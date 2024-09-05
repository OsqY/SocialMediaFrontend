"use client";

import DirectMessagesComponent from "@/components/ui/DirectMessages";
import { useParams } from "next/navigation";

export default function MessagePage() {
  const { username } = useParams();

  return <DirectMessagesComponent  />;
}
