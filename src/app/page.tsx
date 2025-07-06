import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
   <main>
    <SignedOut>
      <SignInButton />
      <SignUpButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
   </main>
  );
}
