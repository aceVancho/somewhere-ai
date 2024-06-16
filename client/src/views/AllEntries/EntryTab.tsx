import { TabsContent } from "@/components/ui/tabs";
import React from "react";

interface EntryTabProps {
  entry: {
    text: string;
  };
}

const EntryTab: React.FC<EntryTabProps> = ({ entry }) => (
  <TabsContent value="Entry" className="px-4">
    <p className="leading-7 whitespace-pre-wrap">{entry.text}</p>
  </TabsContent>
);

export default EntryTab;
