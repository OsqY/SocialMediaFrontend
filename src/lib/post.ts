import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

export interface Post {
  description: string;
  createdDate: string;
}

const API_BASE_URL = "http://localhost:5226";
let connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}/postHub`)
  .build();

export function connectToSignalR(onNewPost: (post: Post) => void) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/postHub`, {
      accessTokenFactory: () => Cookies.get("token") || "",
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("NewPost", onNewPost);
  connection.on("Error", (error: string) => {
    console.error("SignalR Error: ", error);
  });

  return connection.start();
}

export async function createPost(content: string) {
  if (!connection) {
    throw new Error("SignalR connection not initalized");
  }
  await connection.invoke("AddPost", content);
}
