import { headers } from "next/headers";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import { NextRequest, NextResponse } from "next/server";
import { users } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";

// Define a type for the expected Clerk webhook event payload.
// You might want to refine these types based on the specific data you need
// or use types provided by a Clerk SDK if available for webhook payloads.

interface ClerkUserEventData {
  id: string;
  email_addresses?: Array<{
    email_address: string;
    id: string;
    [key: string]: any;
  }>;
  image_url?: string;
  // Add other relevant user properties you expect from Clerk
  [key: string]: any; // Allow for other properties
}

// Define a type for the expected Clerk webhook event payload.
interface ClerkWebhookEvent {
  data: ClerkUserEventData;
  object: "event";
  type: "user.created" | "user.updated" | "user.deleted" | string; // Allow other event types
}

// You'll want to store this in your environment variables
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;

if (!WEBHOOK_SECRET) {
  throw new Error(
    "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
  );
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET as string);

  let evt: ClerkWebhookEvent;

  try {
    // Read the raw request body
    const body = await req.blob();
    const text = await body.text();

    // Verify the webhook signature
    evt = wh.verify(text, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    } as WebhookRequiredHeaders) as ClerkWebhookEvent; // Cast to your defined event type
  } catch (err: any) {
    console.error("Error verifying webhook:", err.message);
    return new Response(err.message, {
      status: 400,
    });
  }

  // Get the event type and data
  const eventType = evt.type;
  const eventData = evt.data;

  try {
    switch (eventType) {
      case "user.created":
        // Handle user creation
        if (!eventData.id || !eventData.email_addresses?.[0]?.email_address) {
          throw new Error("Missing required user data");
        }
        const primaryEmail =
          eventData.email_addresses?.find(
            (emailObj: {
              id: string;
              email_address: string;
              [key: string]: any;
            }) => emailObj.id === eventData.primary_email_address_id,
          )?.email_address || eventData.email_addresses?.[0]?.email_address;

        // Use the first email if primary is not found
        if (!primaryEmail) {
          console.warn(
            `User created event for ${eventData.id} missing primary email.`,
          );
          // For this example, we'll skip if no email. Adjust as per your needs.
          return new Response(
            "User creation skipped, primary email not found.",
            {
              status: 400,
            },
          );
        }

        // Insert the user into the database
        await db.insert(users).values({
          clerkId: eventData.id,
          name: eventData.name || "",
          email: primaryEmail,
          imageUrl: eventData.image_url || "",
        });

        console.log(`User created with email ${primaryEmail}`);

        break;
      case "user.updated":
        // Handle user update
        if (!eventData.id || !eventData.email_addresses?.[0]?.email_address) {
          throw new Error("Missing required user data for update");
        }
        const updatedEmail =
          eventData.email_addresses?.find(
            (emailObj: {
              id: string;
              email_address: string;
              [key: string]: any;
            }) => emailObj.id === eventData.primary_email_address_id,
          )?.email_address || eventData.email_addresses?.[0]?.email_address;

        if (!updatedEmail) {
          console.warn(
            `User updated event for ${eventData.id} missing primary email.`,
          );
          return new Response("User update skipped, primary email not found.", {
            status: 400,
          });
        }
        // Update the user in the database
        await db
          .update(users)
          .set({
            email: updatedEmail,
          })
          .where(eq(users.clerkId, eventData.id));

        console.log(`User updated with email ${updatedEmail}`);

        break;
      case "user.deleted":
        // Handle user deletion
        if (!eventData.id) {
          throw new Error("Missing user ID for deletion");
        }
        // Delete the user from the database
        await db.delete(users).where(eq(users.clerkId, eventData.id));
        console.log(`User deleted with ID ${eventData.id}`);

        break;
      default:
        console.log(`Received unhandled event type: ${eventType}`);
    }

    // Acknowledge receipt of the webhook
    return new Response(`User created ${eventType}`, {
      status: 200,
    });
  } catch (error: any) {
    console.error(`Error handling ${eventType}:`, error.message);
    return new Response(`Error handling ${eventType}: ${error.message}`, {
      status: 500,
    });
  }
}
