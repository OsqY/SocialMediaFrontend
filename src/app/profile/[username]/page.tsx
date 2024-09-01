"use client"

import { useParams } from "next/navigation";
import UserProfile from "@/components/ui/UserProfile";

export default function ProfilePage() {
    const {username} = useParams()
    console.log(username)
  
    if (!username) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto mt-8">
        <UserProfile username={username as string} />
      </div>
    );
  }