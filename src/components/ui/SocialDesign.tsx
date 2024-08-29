import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, BookmarkIcon, Home, Mail, Search, User } from "lucide-react"

export default function Component() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex justify-between items-center p-4 border-b">
        <nav className="flex space-x-4">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button variant="ghost" size="icon">
            <BookmarkIcon className="h-5 w-5" />
            <span className="sr-only">Bookmarks</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </nav>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </header>
      <main className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea className="min-h-[100px]" placeholder="What's happening?" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Image
              </Button>
              <Button variant="outline" size="sm">
                GIF
              </Button>
              <Button variant="outline" size="sm">
                Poll
              </Button>
            </div>
            <Button>Post</Button>
          </CardFooter>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map((tweet) => (
            <Card key={tweet}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder-user.jpg?${tweet}`} alt={`@user${tweet}`} />
                    <AvatarFallback>U{tweet}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">User {tweet}</p>
                    <p className="text-sm text-gray-500">@user{tweet}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>This is a sample tweet {tweet}. It could contain text, images, or other media.</p>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-4 text-gray-500">
                  <Button variant="ghost" size="sm">
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    Retweet
                  </Button>
                  <Button variant="ghost" size="sm">
                    Like
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
