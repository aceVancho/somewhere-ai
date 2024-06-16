import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ChatCardProps {
  entry: {
    _id: string;
  };
}

const ChatCard: React.FC<ChatCardProps> = ({ entry }) => {
  const handleSubmit = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.code === 'Enter') {
      console.log('Hi')
    }
  }

  return (
    <div className="flex flex-col justify-center h-96 border-red-500 border">
      <div className="">Conversation history...</div>
      <Textarea placeholder="I like trains." onKeyDown={handleSubmit} />
    </div>
  );
}

export default ChatCard;
