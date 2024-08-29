"use client"

import SocialDesign from '@/components/ui/SocialDesign';
import LogoutButton from '@/components/ui/LogoutButton';

export default function FeedPage() {
  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <LogoutButton />
      </div>
      <SocialDesign />
    </div>
  );
}