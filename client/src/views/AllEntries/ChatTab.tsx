import React from "react";
import ChatCard from "./ChatCard";
import { TabsContent } from "@/components/ui/tabs";

const ChatTab: React.FC<EntryProps> = ({ entry }) => (
  <TabsContent value="Chat">
    <ChatCard entry={entry} />
  </TabsContent>
);

export default ChatTab;
