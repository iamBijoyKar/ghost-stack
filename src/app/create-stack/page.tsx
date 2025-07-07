import Header from "~/components/header";
import Footer from "~/components/footer";
import CreateStackComponent from "~/components/create-stack";

export default function CreateStack() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <div className="my-10">
        <CreateStackComponent />
      </div>
      <Footer />
    </main>
  );
}
