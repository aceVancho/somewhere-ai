import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";

interface Message {
  text: string;
  timestamp: string;
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
      console.log(msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg.text, timestamp: msg.timestamp, user: msg.user }
      ]);
    });

    newSocket.on('history', (history) => {
      setMessages(history)
    });

    newSocket.on('error', (error) => {
      // TODO: properly handle
      console.error(error);
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
          timestamp: new Date().toLocaleString(),
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
    <div className="flex flex-col h-full justify-center w-full">
      <div className="flex-grow overflow-y-auto p-4 w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 leading-6 font-medium rounded-lg my-2 w-3/4 ${
              msg.user === 'AI-Therapist'
                ? 'bg-muted text-left'
                : 'bg-primary text-white text-right ml-auto'
            }`}
            style={{ alignSelf: msg.user === 'AI-Therapist' ? 'flex-start' : 'flex-end' }}
          >
            <p className={`text-xs ${msg.user === 'AI-Therapist' 
              ? 'text-gray-500' 
              : 'text-muted-foreground'}`}>
                {msg.timestamp || ''} [{msg.user}]:
                </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <Textarea
        className="mt-5 h-24 resize-none p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        placeholder="I like trains."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleSubmit}
      />
    </div>
  );
  
  
}

export default ChatCard;
