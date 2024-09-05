import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Search, Send } from "lucide-react";
import { connectToSignalR, joinChatWithUser, sendMessage, getChatHistory, retrieveHistory, Message, LastMessage } from '@/lib/chat';
import { useParams } from 'next/navigation';

export default function DirectMessagesComponent() {
  const router = useRouter();
  const { username } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<LastMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        await connectToSignalR(
          (message) => setMessages(prev => [...prev, message]),
          (history) => setMessages(history),
          (history) => setConversations(history)
        );
        if (username) {
          await handleSelectConversation(username as string);
        } else {
          await retrieveHistory();
        }
      } catch (err) {
        console.error('SignalR connection error:', err);
      }
    };

    initializeSignalR();
  }, [username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && username) {
      try {
        await sendMessage(username as string, newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleSelectConversation = async (username: string) => {
    try {
      await joinChatWithUser(username);
      await getChatHistory(username);
      router.push(`/message/${username}`);
    } catch (error) {
      console.error('Error getting chat history:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex">
      <div className="w-1/3 border-r border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Messages
          </CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search messages" />
          </div>
        </CardHeader>
        <ScrollArea className="h-[calc(600px-5rem)]">
          {conversations.map((conversation) => (
            <div key={conversation.username} className="flex items-center p-4 cursor-pointer" onClick={() => handleSelectConversation(conversation.username)}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={`/placeholder-avatar.jpg`} alt={conversation.username} />
                <AvatarFallback>{conversation.username[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-sm font-medium">{conversation.username}</p>
                <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle>{username ? username : 'Select a conversation'}</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow px-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex mb-4 ${message.senderName === 'currentUserId' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex ${message.senderName === 'currentUserId' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder-avatar.jpg`} alt={message.senderName} />
                  <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 py-2 px-3 rounded-lg ${
                  message.senderName === 'currentUserId' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <CardContent>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </div>
    </Card>
  );
}