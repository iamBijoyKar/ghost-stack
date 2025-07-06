import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import MyDropzone from "./_components/file-reader";

export default async function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="font-bold text-4xl">Welcome to Ghost Stack!</h1>
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
        <div className="mt-8">
          <MyDropzone />
        </div>
      </main>
  );
}
