import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { connectToSignalR, sendMessage, getChatHistory, Message } from '@/lib/chat'

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const messageEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    connectToSignalR(
      (message) => setMessages(prev => [...prev, message]),
      (history) => setMessages(history)
    ).catch(err => console.error('SignalR connection error:', err));
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && receiverId) {
      try {
        await sendMessage(receiverId, newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleGetChatHistory = async () => {
    if (receiverId) {
      try {
        await getChatHistory(receiverId);
      } catch (error) {
        console.error('Error getting chat history:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <Input
          type="text"
          placeholder="Enter receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="mt-2"
        />
        <Button onClick={handleGetChatHistory} className="mt-2">Load Chat History</Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.senderId === 'currentUserId' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.senderId !== 'currentUserId' && (
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Other user" />
                  <AvatarFallback>OU</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.senderId === 'currentUserId'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.text}
              </div>
              {message.senderId === 'currentUserId' && (
                <Avatar className="ml-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messageEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}