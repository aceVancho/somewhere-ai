import React from "react";
import {
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import EntryHeader from "./EntryHeader";
import EntryTab from "./EntryTab";
import AnalysisTab from "./AnalysisTab";
import ChatTab from "./ChatTab";

const Entry: React.FC<EntryProps> = ({entry}) => {
  return (
    <AccordionItem value={entry._id} className="my-4 border rounded-md shadow-md">
      <EntryHeader entry={entry} />
      <AccordionContent asChild className="px-10">
        <Separator className="mb-5" />
        <Tabs defaultValue="Entry" className="w-full mt-2">
          <div className="flex justify-center">
            <TabsList className="grid w-1/2 grid-cols-3 gap-1">
              <TabsTrigger value="Entry">Entry</TabsTrigger>
              <TabsTrigger value="Analysis">Analysis</TabsTrigger>
              <TabsTrigger value="Chat">Chat</TabsTrigger>
            </TabsList>
          </div>
          <EntryTab entry={entry} />
          <AnalysisTab entry={entry} />
          <ChatTab entry={entry} />
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Entry;
