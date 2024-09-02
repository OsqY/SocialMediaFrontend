import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Hash } from "lucide-react"

interface SearchResult {
  id: number
  type: 'user' | 'tweet' | 'hashtag'
  content: string
  user?: {
    name: string
    handle: string
    avatar: string
  }
}

const mockResults: SearchResult[] = [
  { id: 1, type: 'user', content: 'John Doe', user: { name: 'John Doe', handle: '@johndoe', avatar: '/placeholder-avatar.jpg' } },
  { id: 2, type: 'tweet', content: 'Just had an amazing day at the beach! #summervibes', user: { name: 'Jane Smith', handle: '@janesmith', avatar: '/placeholder-avatar.jpg' } },
  { id: 3, type: 'hashtag', content: '#TechTalk' },
  { id: 4, type: 'user', content: 'Alice Johnson', user: { name: 'Alice Johnson', handle: '@alicej', avatar: '/placeholder-avatar.jpg' } },
  { id: 5, type: 'tweet', content: 'New product launch coming soon! Stay tuned for updates. #innovation', user: { name: 'Tech Company', handle: '@techco', avatar: '/placeholder-avatar.jpg' } },
]

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = mockResults.filter(result => 
      result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.user?.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setResults(filtered)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search Twitter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {results.map(result => (
              <div key={result.id} className="flex items-center space-x-4 mb-4 p-2 rounded-lg hover:bg-muted">
                {result.type === 'user' && (
                  <Avatar>
                    <AvatarImage src={result.user?.avatar} alt={result.user?.name} />
                    <AvatarFallback>{result.user?.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                {result.type === 'tweet' && (
                  <Avatar>
                    <AvatarImage src={result.user?.avatar} alt={result.user?.name} />
                    <AvatarFallback>{result.user?.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                {result.type === 'hashtag' && <Hash className="w-8 h-8" />}
                <div>
                  <p className="font-medium">{result.content}</p>
                  {result.user && <p className="text-sm text-muted-foreground">{result.user.handle}</p>}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="users">
            {results.filter(r => r.type === 'user').map(result => (
              <div key={result.id} className="flex items-center space-x-4 mb-4 p-2 rounded-lg hover:bg-muted">
                <Avatar>
                  <AvatarImage src={result.user?.avatar} alt={result.user?.name} />
                  <AvatarFallback>{result.user?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{result.content}</p>
                  <p className="text-sm text-muted-foreground">{result.user?.handle}</p>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="hashtags">
            {results.filter(r => r.type === 'hashtag').map(result => (
              <div key={result.id} className="flex items-center space-x-4 mb-4 p-2 rounded-lg hover:bg-muted">
                <Hash className="w-8 h-8" />
                <p className="font-medium">{result.content}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}