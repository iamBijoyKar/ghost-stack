import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Header from "../components/header";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <h1 className="text-4xl font-bold">Welcome to Ghost Stack!</h1>
      <p className="text-lg">
        This is a full-stack application built with Next.js, tRPC, and
        PostgreSQL.
      </p>
      <SignedIn>
        <div className="flex flex-col items-center">
          <p className="text-lg">You are signed in!</p>
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <p className="text-lg">You are not signed in.</p>
        <Link href="/sign-in" className="text-blue-500">
          Sign In
        </Link>
      </SignedOut>
    </main>
  );
}
