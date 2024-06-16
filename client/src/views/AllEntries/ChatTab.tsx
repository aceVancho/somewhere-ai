import React from "react";
import ChatCard from "./ChatCard";
import { TabsContent } from "@/components/ui/tabs";

interface ChatTabProps {
  entry: {
    _id: string;
  };
}

const ChatTab: React.FC<ChatTabProps> = ({ entry }) => (
  <TabsContent value="Chat">
    <ChatCard entry={entry} />
  </TabsContent>
);

export default ChatTab;
