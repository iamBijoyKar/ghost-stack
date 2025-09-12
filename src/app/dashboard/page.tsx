"use client";

import { useEffect, useState } from "react";
import { getUserStacks, deleteStack } from "~/server/actions/stack";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Calendar,
  Package,
  ExternalLink,
  LayoutGrid as LayoutGridIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CodeBlock } from "~/components/ui/code";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { Toaster } from "~/components/ui/sonner";

interface StackItem {
  icon: string;
  name: string;
  source: string;
  version: string;
}

interface Stack {
  id: string;
  name: string;
  description: string | null;
  stack: StackItem[];
  createdAt: Date;
  updatedAt: Date | null;
}

export default function Dashboard() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      const result = await getUserStacks();
      if (result.success) {
        setStacks(result.stacks as Stack[]);
      } else {
        toast.error("Failed to fetch stacks");
      }
    } catch (error) {
      toast.error("Error fetching stacks");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStack = async (stackId: string) => {
    try {
      const result = await deleteStack(stackId);
      if (result.success) {
        setStacks(stacks.filter((stack) => stack.id !== stackId));
        toast.success("Stack deleted successfully");
      } else {
        toast.error("Failed to delete stack");
      }
    } catch (error) {
      toast.error("Error deleting stack");
    }
  };

  const copyInstallCommand = (stack: Stack) => {
    const command = `winget install ${stack.stack.map((item) => item.source).join(" ")}`;
    navigator.clipboard.writeText(command);
    toast.success("Install command copied to clipboard");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto flex-1 px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Stacks</h1>
            <p className="text-muted-foreground">
              Manage your application stacks and installation commands
            </p>
          </div>
          <Link href="/create-stack">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create New Stack
            </Button>
          </Link>
        </div>

        {/* Stacks Grid */}
        {stacks.length === 0 ? (
          <div className="py-12 text-center">
            <LayoutGridIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No stacks yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first application stack to get started
            </p>
            <Link href="/create-stack">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Stack
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <Card
                key={stack.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{stack.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {stack.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStack(stack.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stack Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4" />
                      Applications ({stack.stack.length})
                    </div>
                    <div className="max-h-32 space-y-1 overflow-y-auto">
                      {stack.stack.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Avatar className="h-5 w-5 rounded-none">
                            <AvatarImage src={item.icon} alt={item.name} />
                            <AvatarFallback>
                              <LayoutGridIcon className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate">{item.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.version}
                          </Badge>
                        </div>
                      ))}
                      {stack.stack.length > 5 && (
                        <div className="text-muted-foreground text-xs">
                          +{stack.stack.length - 5} more applications
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Install Command Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Copy className="h-4 w-4" />
                      Install Command
                    </div>
                    <CodeBlock
                      code={`winget install ${stack.stack
                        .map((item) => item.source)
                        .slice(0, 3)
                        .join(" ")}${stack.stack.length > 3 ? "..." : ""}`}
                      className="text-xs"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInstallCommand(stack)}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      Copy Command
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const command = `winget install ${stack.stack.map((item) => item.source).join(" ")}`;
                        const blob = new Blob([command], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${stack.name.replace(/\s+/g, "-").toLowerCase()}-install.bat`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(stack.createdAt)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stack.stack.length} apps
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Toaster />
    </main>
  );
}
