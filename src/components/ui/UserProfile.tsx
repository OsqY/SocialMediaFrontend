import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, LinkIcon } from 'lucide-react'

interface Tweet {
  id: number
  content: string
  likes: number
  retweets: number
  comments: number
  date: string
}

export default function Component() {
  const user = {
    name: "Jane Doe",
    handle: "@janedoe",
    bio: "Software engineer | Coffee enthusiast | Dog lover",
    location: "San Francisco, CA",
    website: "https://janedoe.com",
    joinDate: "September 2010",
    following: 1234,
    followers: 5678,
    tweets: 9876
  }

  const recentTweets: Tweet[] = [
    {
      id: 1,
      content: "Just deployed my latest project! Check it out at https://myproject.com #webdev #react",
      likes: 42,
      retweets: 12,
      comments: 5,
      date: "2h ago"
    },
    {
      id: 2,
      content: "Excited to attend the upcoming tech conference next month! Anyone else going? #techconf2023",
      likes: 31,
      retweets: 8,
      comments: 3,
      date: "1d ago"
    },
    {
      id: 3,
      content: "Just finished reading 'Clean Code' by Robert C. Martin. Highly recommend it to all developers! #coding #bestpractices",
      likes: 56,
      retweets: 15,
      comments: 7,
      date: "3d ago"
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <Avatar className="w-24 h-24 border-4 border-background absolute bottom-0 left-4 transform translate-y-1/2">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="pt-12">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.handle}</p>
            </div>
            <Button>Follow</Button>
          </div>
          <p className="mb-4">{user.bio}</p>
          <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {user.location}
            </div>
            <div className="flex items-center">
              <LinkIcon className="w-4 h-4 mr-1" />
              <a href={user.website} className="text-primary">{user.website}</a>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Joined {user.joinDate}
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div><span className="font-bold">{user.following}</span> Following</div>
            <div><span className="font-bold">{user.followers}</span> Followers</div>
            <div><span className="font-bold">{user.tweets}</span> Tweets</div>
          </div>
          <Tabs defaultValue="tweets">
            <TabsList>
              <TabsTrigger value="tweets">Tweets</TabsTrigger>
              <TabsTrigger value="replies">Replies</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            <TabsContent value="tweets">
              {recentTweets.map(tweet => (
                <Card key={tweet.id} className="mb-4">
                  <CardContent className="pt-6">
                    <p className="mb-2">{tweet.content}</p>
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>{tweet.date}</span>
                      <div className="flex gap-4">
                        <span>{tweet.comments} Comments</span>
                        <span>{tweet.retweets} Retweets</span>
                        <span>{tweet.likes} Likes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="replies">
              <p className="text-muted-foreground">No replies to show.</p>
            </TabsContent>
            <TabsContent value="media">
              <p className="text-muted-foreground">No media to show.</p>
            </TabsContent>
            <TabsContent value="likes">
              <p className="text-muted-foreground">No likes to show.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}