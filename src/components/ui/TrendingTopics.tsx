import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, MoreHorizontal } from 'lucide-react'

interface TrendingTopic {
  id: number
  topic: string
  tweetCount: number
  category?: string
}

export default function Component() {
  const trendingTopics: TrendingTopic[] = [
    { id: 1, topic: "#TechConference2023", tweetCount: 52300, category: "Technology" },
    { id: 2, topic: "New iPhone Release", tweetCount: 121000, category: "Technology" },
    { id: 3, topic: "#ClimateAction", tweetCount: 89700, category: "Environment" },
    { id: 4, topic: "SpaceX Launch", tweetCount: 75600 },
    { id: 5, topic: "#MondayMotivation", tweetCount: 32100 },
    { id: 6, topic: "Crypto Market", tweetCount: 45800, category: "Finance" },
    { id: 7, topic: "Olympic Trials", tweetCount: 68900, category: "Sports" },
    { id: 8, topic: "#NewMusicFriday", tweetCount: 28400, category: "Music" },
    { id: 9, topic: "AI Ethics Debate", tweetCount: 39200, category: "Technology" },
    { id: 10, topic: "Global Education Summit", tweetCount: 22700, category: "Education" },
  ]

  const formatTweetCount = (count: number): string => {
    if (count > 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count > 1000) {
      return (count / 1000).toFixed(1) + 'K'
    } else {
      return count.toString()
    }
  }

  return (
    <Card className="w-80 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {trendingTopics.map((topic) => (
            <li key={topic.id} className="group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium group-hover:underline cursor-pointer">
                    {topic.topic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTweetCount(topic.tweetCount)} Tweets
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              {topic.category && (
                <p className="text-xs text-muted-foreground mt-1">
                  Trending in {topic.category}
                </p>
              )}
            </li>
          ))}
        </ul>
        <Button variant="link" className="w-full mt-4">
          Show more
        </Button>
      </CardContent>
    </Card>
  )
}