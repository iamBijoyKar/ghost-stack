"use server";

import { db } from "../db";
import { stacks } from "../db/schema";
import { currentUser } from "@clerk/nextjs/server";

type Stack = {
  icon: string;
  name: string;
  source: string;
  version: string;
};

export async function createStack(stacks_: Stack[]) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    // Insert the stack into the database
    await db.insert(stacks).values({
      name: "New Stack",
      description: "A new stack created from the provided data",
      userId: user.id,
      stack: stacks_,
    });
    return { success: true, message: "Stack created successfully" };
  } catch (error) {
    console.error("Error creating stack:", error);
    return { success: false, message: "Error creating stack" };
  }
}
