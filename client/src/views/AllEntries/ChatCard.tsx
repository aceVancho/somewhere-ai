import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";

interface Message {
  text: string;
  timestamp: string;
  user: string;
}

const ChatCard: React.FC<EntryProps> = ({entry}) => {
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
    <div className="flex flex-col h-full justify-center items-center w-full whitespace-pre-wrap antialiased">
      <div className=" p-4 w-3/4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 flex rounded-lg my-2 shadow-md w-3/4 ${
              msg.user === 'AI-Therapist'
                ? 'bg-muted text-left justify-start'
                : 'bg-primary text-white text-right ml-auto justify-end'
            }`}
            style={{ alignSelf: msg.user === 'AI-Therapist' ? 'flex-start' : 'flex-end' }}
          >
            <div className="flex flex-col">
              <p className={`text-sm mb-1 font-semibold ${msg.user === 'AI-Therapist' 
                ? 'text-muted-foreground' 
                : 'text-muted-background'}`}>
                  {msg.timestamp || ''} [{msg.user}]:
                  </p>
              <p className="text-sm font-medium leading-7">{msg.text}</p>

            </div>
          </div>
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
  
  
}

export default ChatCard;
