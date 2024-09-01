import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, LinkIcon } from 'lucide-react'
import { getUserProfile } from '@/lib/user'
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

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
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        let userToFetch = username;

        if (!userToFetch) {
          const token = Cookies.get('token');
          if (token) {
            const decodedToken: any = jwtDecode(token);
            userToFetch = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          }
        }

        if (userToFetch) {
          const userData = await getUserProfile(userToFetch);
          setUser(userData);
          setError(null);
        } else {
          setError('No username found');
        }
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Error: {error || 'Failed to load user profile'}</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <Card>
        <CardHeader className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <Avatar className="w-24 h-24 border-4 border-background absolute bottom-0 left-4 transform translate-y-1/2">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user.username} />
            <AvatarFallback>{user.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="pt-12">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              {user.isOwnUserProfile && <p className="text-muted-foreground">This is your profile</p>}
            </div>
            {user.isOwnUserProfile ? (
              <Button>Edit Profile</Button>
            ) : (
              <Button>Follow</Button>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <div><span className="font-bold">{user.followingCount}</span> Following</div>
            <div><span className="font-bold">{user.followersCount}</span> Followers</div>
            <div><span className="font-bold">{user.posts.length}</span> Posts</div>
          </div>
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {user.posts.map(post => (
                <Card key={post.id} className="mb-4 bg-card text-card-foreground">
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