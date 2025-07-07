import React, { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "~/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "bash",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        `relative w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/95 font-mono text-sm shadow-lg backdrop-blur-sm ${className}`,
      )}
    >
      <button
        aria-label="Copy code"
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 rounded-md border border-neutral-700 bg-neutral-800 p-1.5 transition-colors hover:bg-neutral-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span className="sr-only">Copy code</span>
        <span
          className={`transition-opacity duration-200 ${
            copied ? "opacity-0" : "opacity-100"
          }`}
        >
          <Copy size={16} className="text-neutral-300" />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check size={16} className="text-green-400" />
        </span>
      </button>
      <div className="flex h-full w-full">
        <pre className="m-0 p-4 break-words whitespace-pre-wrap">
          <code className={`language-${language} text-neutral-100`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
