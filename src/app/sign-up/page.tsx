import { SignUp } from "@clerk/nextjs";
import Header from "~/components/header";
import Footer from "~/components/footer";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Header />
      <div className="my-14">
        <SignUp />
      </div>
      <Footer />
    </div>
  );
}
