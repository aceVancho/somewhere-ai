import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Message {
  text: string;
  timestamp: string;
  user: string;
}

const ChatCard: React.FC<EntryProps> = ({ entry }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4001", {
      auth: {
        token: localStorage.getItem("somewhereAIToken"),
      },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected to meGPT Server");
      newSocket.emit("joinSession", {
        sessionId: entry._id,
        email: user?.email,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected from meGPT server");
    });

    // Listen for new messages
    newSocket.on(
      "message",
      (msg: { text: string; timestamp: string; user: string }) => {
        console.log(msg);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: msg.text, timestamp: msg.timestamp, user: msg.user },
        ]);
      }
    );

    newSocket.on("history", (history) => {
      setMessages(history);
    });

    newSocket.on("error", (error) => {
      // TODO: properly handle
      console.error(error);
    });

    return () => {
      newSocket.close();
    };
  }, [entry._id, user?.email]);

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && socket) {
        const newMessage: Message = {
          text: message,
          timestamp: new Date().toLocaleString(),
          user: user?.email || "Anonymous",
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("message", {
          sessionId: entry._id,
          token: localStorage.getItem("somewhereAIToken"),
          message: message,
        });
        setMessage("");
      }
    }
  };

  interface MessageCardProps {
    msg: Message;
  }

  const MessageCard: React.FC<MessageCardProps> = ({ msg }) => {
    const [date, time] = msg.timestamp.split(',')
    return (
      <Card className={
        `m-2 
        ${msg.user === 'AI-Therapist' 
        ? 'bg-muted text-left animate__animated animate__fadeInLeft' 
        : 'bg-primary text-right animate__animated animate__fadeInRight'
        }`}>
        <CardHeader>
          <CardTitle >{date} | {time} | {msg.user}</CardTitle>
          {/* <CardDescription>{msg.user}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <p>{msg.text}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full justify-center items-center w-full whitespace-pre-wrap antialiased">
      <div className="flex flex-col w-3/4">
        {messages.map((msg, index) => (
          <MessageCard key={index} msg={msg} />
        ))}
      </div>
      <div className="w-full p-5">
        <Textarea
          className="mt-5 h-24 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="I like trains."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatCard;
