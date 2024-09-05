import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

export interface Message {
  content: string;
  senderName: string;
  receiverName: string;
  createdDate: string;
}

export interface LastMessage {
  username: string;
  lastMessage: string;
}

const API_BASE_URL = 'http://localhost:5226';
let connection: signalR.HubConnection;

export async function connectToSignalR(onNewMessage: (message: Message) => void, onChatHistory: (history: Message[]) => void, onRetrieveHistory: (history: LastMessage[]) => void): Promise<void> {
  connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE_URL}/chatHub`, {
    accessTokenFactory: () => Cookies.get('token') || '',
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build();

  connection.on("NewMessage", onNewMessage);
  connection.on("GetChatMessages", onChatHistory);
  connection.on("RetrieveHistory", onRetrieveHistory);
  connection.on("Error", (error: string) => {
    console.error("SignalR Error: ", error);
  });

  await connection.start();
}

export async function joinChatWithUser(username: string) {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR connection not initialized or not connected");
  }
  await connection.invoke("JoinChatWithUser", username);
}

export async function sendMessage(receiverUsername: string, content: string) {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR connection not initialized or not connected");
  }
  await connection.invoke("SendMessageToUser", receiverUsername, content);
}

export async function getChatHistory(username: string) {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR connection not initialized or not connected");
  }
  await connection.invoke("GetChatMessages", username);
}

export async function retrieveHistory() {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR connection not initialized or not connected");
  }
  await connection.invoke("RetrieveHistory");
}