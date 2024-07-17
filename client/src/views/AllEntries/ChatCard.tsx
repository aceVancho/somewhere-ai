import React, { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";
import { v4 as uuidv4 } from "uuid";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  user: string;
  type: 'human' | 'ai';
}

const ChatCard: React.FC<EntryProps> = ({ entry }) => {
  const { user } = useAuth();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

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
    newSocket.on("message", (msg: { text: string; timestamp: string; user: string, type: string }) => {
      const id = uuidv4();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id, text: msg.text, timestamp: msg.timestamp, user: msg.user, type: 'ai' },
      ]);
    });

    newSocket.on("history", (history) => {
      const formattedHistory = history.map((msg: { text: string; timestamp: string; user: string, type: string }) => ({
        id: uuidv4(),
        ...msg,
        type: msg.user === "AI-Therapist" ? 'ai' : 'human'
      }));
      setMessages(formattedHistory);
    });

    newSocket.on("error", (error) => {
      console.error(error);
    });

    return () => {
      newSocket.close();
    };
  }, [entry._id, user?.email]);

  useEffect(() => {
    if (lastMessageRef.current) {
      const lastMessageElement = lastMessageRef.current;
      const animationClass = lastMessageElement.classList.contains('ai')
        ? 'animate__fadeInLeft'
        : 'animate__fadeInRight';

      lastMessageElement.classList.add('animate__animated', animationClass);

      const removeAnimationClass = () => {
        lastMessageElement.classList.remove('animate__animated', animationClass);
      };

      const timeoutId = setTimeout(removeAnimationClass, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [messages]);

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && socket) {
        const id = uuidv4();
        const newMessage: Message = {
          id,
          text: input,
          timestamp: new Date().toLocaleString(),
          user: user?.email || "Anonymous",
          type: 'human'
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("message", {
          sessionId: entry._id,
          token: localStorage.getItem("somewhereAIToken"),
          message: input,
        });
        setInput("");
      }
    }
  };

  interface MessageCardProps {
    msg: Message;
    refProp?: React.RefObject<HTMLDivElement>;
  }

  const MessageCard: React.FC<MessageCardProps> = ({ msg, refProp }) => {
    const [date, time] = msg.timestamp.split(",");
    return (
      <Card
        ref={refProp}
        className={`m-2 ${msg.type} ${
          msg.type === "ai"
            ? "bg-muted text-left"
            : "bg-primary text-white text-right"
        }`}
      >
        <CardHeader>
          <CardTitle>
            {date} | {time} | {msg.user}
          </CardTitle>
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
          <MessageCard
            key={msg.id}
            msg={msg}
            refProp={index === messages.length - 1 ? lastMessageRef : undefined}
          />
        ))}
      </div>
      <div className="w-full p-5">
        <Textarea
          className="mt-5 h-24 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="I like trains."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatCard;
