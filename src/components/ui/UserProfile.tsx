import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkIfFollowing,
  connectToSignalR,
  getUserByUsername,
  getUserProfile,
  followUser,
  unfollowUser,
} from "@/lib/user";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface PostDTO {
  id: number;
  description: string;
  createdDate: string;
}

interface UserProfileData {
  username: string;
  followersCount: number;
  followingCount: number;
  posts: PostDTO[];
  isOwnUserProfile: boolean;
}

interface UserProfileProps {
  username?: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  const [isBeingFollowed, setIsBeingFollowed] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token") || null;

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        let userToFetch = username;

        if (!userToFetch) {
          const ownUser = await getUserProfile();
          if (ownUser != null) {
            setUser(ownUser);
            setError(null);
          }
        } else {
          if (userToFetch) {
            const userData = await getUserByUsername(userToFetch);
            setUser(userData);
            setError(null);
            if (token) {
              const checkIfCurrentUserIsFollowed = await checkIfFollowing(
                userToFetch
              );
              setIsBeingFollowed(
                checkIfCurrentUserIsFollowed == "Unfollow" ? true : false
              );
            }
          } else {
            setError("No username found");
          }
        }
      } catch (err) {
        setError("Failed to load user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    connectToSignalR().catch((err) =>
      console.error("SignalR connection error:", err)
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Error: {error || "Failed to load user profile"}</div>;
  }

  const handleFollow = async () => {
    try {
      await followUser(user.username);
      setIsBeingFollowed(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(user.username);
      setIsBeingFollowed(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <Card>
        <CardHeader className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <Avatar className="w-24 h-24 border-4 border-background absolute bottom-0 left-4 transform translate-y-1/2">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user.username} />
            <AvatarFallback>
              {user.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="pt-12">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              {user.isOwnUserProfile && (
                <p className="text-muted-foreground">This is your profile</p>
              )}
            </div>
            <div className="flex space-x-2">
              {user.isOwnUserProfile ? (
                <Button>Edit Profile</Button>
              ) : (
                <>
                  {isBeingFollowed ? (
                    <Button onClick={handleUnfollow}>Unfollow</Button>
                  ) : (
                    <Button onClick={handleFollow}>Follow</Button>
                  )}
                  <Link href={`/message/${user.username}`} passHref>
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div>
              <span className="font-bold">{user.followingCount}</span> Following
            </div>
            <div>
              <span className="font-bold">{user.followersCount}</span> Followers
            </div>
            <div>
              <span className="font-bold">{user.posts.length}</span> Posts
            </div>
          </div>
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {user.posts.map((post) => (
                <Card
                  key={post.id}
                  className="mb-4 bg-card text-card-foreground"
                >
                  <CardContent className="pt-6">
                    <p className="mb-2">{post.description}</p>
                    <div className="text-muted-foreground text-sm">
                      <span>{new Date(post.createdDate).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}