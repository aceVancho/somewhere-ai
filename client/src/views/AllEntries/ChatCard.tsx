import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";

interface Message {
  text: string;
  timestamp: Date;
  user: string;
}

interface EntryProps {
  entry: {
    _id: string;
  };
}

const ChatCard: React.FC<EntryProps> = ({ entry }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4001', {
      auth: {
        token: localStorage.getItem('somewhereAIToken'),
      },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected to meGPT Server');
      newSocket.emit('joinSession', {
        sessionId: entry._id, 
        email: user?.email
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected from meGPT server');
    });

    // Listen for new messages
    newSocket.on('message', (msg: { text: string; timestamp: string; user: string }) => {
      console.log(msg.timestamp);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg.text, timestamp: new Date(msg.timestamp), user: msg.user }
      ]);
    });

    return () => {
      newSocket.close();
    };
  }, [entry._id, user?.email]);

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && socket) {
        const newMessage: Message = {
          text: message,
          timestamp: new Date(),
          user: user?.email || 'Anonymous'
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit('message', {
          sessionId: entry._id,
          token: localStorage.getItem("somewhereAIToken"),
          message: message,
        });
        setMessage("");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center h-96 border-red-500 border">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2">
            <span>{msg.timestamp.toLocaleTimeString()} [{msg.user}]: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <Textarea
        placeholder="I like trains."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleSubmit}
      />
    </div>
  );
}

export default ChatCard;
