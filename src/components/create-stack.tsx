"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Layers2,
  ListTodo,
  Terminal,
  ChevronRight,
  CopyPlus,
  Trash2,
  LayoutGrid as LayoutGridIcon,
  HardDriveDownload,
} from "lucide-react";
import MyDropzone from "../components/file-reader";
import { CodeBlock } from "./ui/code";
import data from "~/data/data.json";
import Link from "next/link";
import { createStack } from "~/server/actions/stack";

export default function CreateStack() {
  const [activeTab, setActiveTab] = useState("step1");
  const [value, setValue] = useState<string[]>([]);
  const [appData, setAppData] = useState<any[]>([]);
  const [selectedApps, setSelectedApps] = useState<any[]>([]);
  const [installCommand, setInstallCommand] = useState<string>("");
  const [batUrl, setBatUrl] = useState<string>("");

  const handleValueChange = (newValue: string[]) => {
    setValue(newValue);
    const selectedApps = newValue.map((val) => {
      const item = Object.values(data).find((item) => item.value === val);
      return {
        name: item?.label || "Unknown",
        version: "latest",
        icon: item?.icon || "",
        source: item?.source || "Unknown",
      };
    });
    setSelectedApps(selectedApps);
  };

  const handleDownloadBatFile = () => {
    const blob = new Blob([installCommand], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setBatUrl(url);
  };

  const handleCreateStack = async () => {
    const result = await createStack(selectedApps);
    if (result.success) {
      // Handle successful stack creation
    } else {
      // Handle stack creation error
    }
  };

  useEffect(() => {
    let command = `winget install`;
    appData.forEach((app) => {
      command += ` ${app.sourceId}`;
    });
    selectedApps.forEach((app) => {
      command += ` ${app.source}`;
    });
    setInstallCommand(command);
  }, [appData, selectedApps]);

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
        {/* Step 4 */}
        <TabsTrigger value="step4">
          {" "}
          <div className="flex items-center gap-1">
            <HardDriveDownload className="h-5 w-5" />
            <span className="">Step 4</span>
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
          <MyDropzone setAppData={setAppData} />
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveTab("step1")}>
              Prev
            </Button>
            <Button onClick={() => setActiveTab("step3")}>Next</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="step3">
        <div className="motion-preset-fade-sm flex w-full flex-col items-center justify-center gap-2">
          <MultiSelector
            values={value}
            onValuesChange={handleValueChange}
            loop={false}
            className=""
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select your framework" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList className="h-[200px]">
                {data.map((option, i) => (
                  <MultiSelectorItem
                    key={i}
                    value={option.value}
                    data-source={option.source}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5 rounded-none">
                        <AvatarImage src={option.icon} alt={option.label} />
                      </Avatar>
                      <span>{option.label}</span>
                    </div>
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          {/* table  */}
          <ScrollArea className="mt-4 h-[300px] w-full">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedApps.map((app, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Avatar className="h-5 w-5 rounded-none">
                        <AvatarImage src={app.icon} alt={app.name} />
                        <AvatarFallback>
                          <LayoutGridIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {app.name}
                    </TableCell>
                    <TableCell className="truncate">{app.version}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="p-1 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {appData.map((app, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Avatar className="h-5 w-5 rounded-none">
                        <AvatarImage src={app.icon} alt={app.name} />
                        <AvatarFallback>
                          <LayoutGridIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {app.name}
                    </TableCell>
                    <TableCell className="truncate">{app.version}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="p-1 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setActiveTab("step2")}>
            Prev
          </Button>
          <Button onClick={() => setActiveTab("step4")}>Next</Button>
        </div>
      </TabsContent>
      <TabsContent value="step4">
        <div className="motion-preset-fade-sm flex w-full flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground text-sm">
            Review your selected applications and click on the "Create Stack"
            button to save your stack in cloud storage.
          </p>
          <CodeBlock
            code={`${installCommand} 
          `}
            className="overflow-hidden"
          />
          <p className="text-muted-foreground mt-2 text-sm">
            This command will install the selected applications on your system.
            Otherwise download the bat file and run it.
          </p>
          <Link href={batUrl} download="install.bat">
            <Button className="mt-2">
              <HardDriveDownload className="mr-2 h-4 w-4" />
              Download Batch File
            </Button>
          </Link>
          <div className="mt-4 flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveTab("step3")}>
              Back
            </Button>
            <Button onClick={handleCreateStack}>Create Stack</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
