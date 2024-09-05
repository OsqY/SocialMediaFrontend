import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Heart, MessageCircle, Repeat, User } from "lucide-react";
import { connectToSignalR } from "@/lib/user";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

interface Notification {
  id: number;
  type: "like" | "repost" | "reply" | "follow";
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "like",
    user: { name: "John Doe", avatar: "/placeholder-avatar.jpg" },
    content: "liked your tweet",
    time: "2m ago",
  },
  {
    id: 2,
    type: "repost",
    user: { name: "Jane Smith", avatar: "/placeholder-avatar.jpg" },
    content: "retweeted your post",
    time: "15m ago",
  },
  {
    id: 3,
    type: "reply",
    user: { name: "Alice Johnson", avatar: "/placeholder-avatar.jpg" },
    content: "replied to your tweet",
    time: "1h ago",
  },
  {
    id: 4,
    type: "follow",
    user: { name: "Bob Wilson", avatar: "/placeholder-avatar.jpg" },
    content: "followed you",
    time: "2h ago",
  },
];

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  switch (type) {
    case "like":
      return <Heart className="w-4 h-4 text-red-500" />;
    case "repost":
      return <Repeat className="w-4 h-4 text-green-500" />;
    case "reply":
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case "follow":
      return <User className="w-4 h-4 text-purple-500" />;
  }
};

export default function NotificationsComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    connectToSignalR(
      (message) => {
        const newNotification: Notification = {
          id: notifications.length + 1,
          type: "follow",
          user: { name: "New follower", avatar: "/placeholder-avatar.jpg" },
          content: message,
          time: Date.now().toString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    ).catch((error) => console.error("SignalR connection error: ", error));
  }, [notifications]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-4 mb-4 p-2 rounded-lg hover:bg-muted"
            >
              <Avatar>
                <AvatarImage
                  src={notification.user.avatar}
                  alt={notification.user.name}
                />
                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <NotificationIcon type={notification.type} />
                  <p className="text-sm font-medium">
                    {notification.user.name}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
