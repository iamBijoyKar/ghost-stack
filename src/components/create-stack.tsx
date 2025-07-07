"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { Button } from "./ui/button";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "~/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import {
  Layers2,
  ListTodo,
  Terminal,
  ChevronRight,
  CopyPlus,
} from "lucide-react";
import MyDropzone from "../components/file-reader";

export default function CreateStack() {
  const [activeTab, setActiveTab] = useState("step1");
  const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ];
  const [value, setValue] = useState<string[]>([]);

  return (
    <Tabs
      defaultValue="step1"
      value={activeTab}
      className="bg-background mt-10 w-full rounded-lg border p-4 shadow-md sm:w-[400px] md:w-[600px]"
    >
      <TabsList>
        {/* Step 1 */}
        <TabsTrigger value="step1">
          <div className="flex items-center gap-1">
            <Terminal className="h-4 w-4" />
            <span className="">Step 1</span>
          </div>
        </TabsTrigger>
        {/* Step 2 */}
        <TabsTrigger value="step2">
          {" "}
          <div className="flex items-center gap-1">
            <Layers2 className="h-4 w-4" />
            <span className="">Step 2</span>
          </div>
        </TabsTrigger>
        {/* Step 3 */}
        <TabsTrigger value="step3">
          {" "}
          <div className="flex items-center gap-1">
            <ListTodo className="h-5 w-5" />
            <span className="">Step 3</span>
          </div>
        </TabsTrigger>
      </TabsList>
      {/* table content */}
      <Separator />
      <TabsContent value="step1">
        <div className="motion-preset-fade-sm w-full">
          <h3 className="text-xl font-bold">Prerequisites</h3>
          <ul className="text-muted-foreground mt-2 list-disc pl-5">
            <li>Windows system are only supported for now!</li>
            <li>Your system must have winget installed.</li>
          </ul>
          <blockquote className="mt-4 border-l-2 pl-6 italic">
            We do not run malicious code on your system. This project is open
            source and you can inspect the code yourself.
          </blockquote>

          <h3 className="mt-4 text-xl font-bold">Run command</h3>
          <pre className="text-muted-foreground bg-accent w-full rounded p-2 font-mono text-sm font-semibold">
            winget list &gt; apps.txt
          </pre>
          <div className="mt-4 flex items-center justify-end gap-2">
            <HoverCard openDelay={300}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("step3")}
                  className="flex items-center gap-2"
                >
                  <span className="">Manual</span>
                  <CopyPlus className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="bg-background mt-2 w-[300px] rounded-lg border p-2 shadow">
                <p className="text-muted-foreground text-sm">
                  You skip the command run and upload steps to add all the
                  applications by yourself.
                </p>
              </HoverCardContent>
            </HoverCard>
            <Button
              onClick={() => setActiveTab("step2")}
              className="flex items-center gap-2"
            >
              <span className="">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="step2">
        <div className="motion-preset-fade-sm flex h-[350px] w-full flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Upload your winget text file to parse the applications installed on
            your system.
          </p>
          <MyDropzone />
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline">Skip</Button>
            <Button onClick={() => setActiveTab("step3")}>Next</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="step3">
        <div className="motion-preset-fade-sm flex w-full flex-col items-center justify-center gap-2">
          <MultiSelector values={value} onValuesChange={setValue} loop={false}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select your framework" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {options.map((option, i) => (
                  <MultiSelectorItem key={i} value={option.value}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          {/* table  */}
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
