import { Ghost } from "lucide-react";
import Link from "next/link";
// This component renders the logo for the Ghost Stack application.
// It uses the Ghost icon from lucide-react and displays the name "Ghost Stack".

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Ghost className="h-6 w-6" />
        <span className="text-lg font-bold">Ghost Stack</span>
      </div>
    </Link>
  );
}
