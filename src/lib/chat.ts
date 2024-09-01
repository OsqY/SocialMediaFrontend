import * as signalR from "@microsoft/signalr"
import axios from "axios";
import Cookies from 'js-cookie'

export interface Message {
    id: number;
    text: string;
    senderId: string;
    receiverId: string;
    createdDate: string;
  }

const API_BASE_URL ='http://localhost:5226'
let connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE_URL}/chatHub`).build();

export function connectToSignalR(onNewMessage : (message: Message) => void, onChatHistory: (history: Message[]) => void) {
    connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE_URL}/chatHub`, {
        accessTokenFactory: () => Cookies.get('token') ||''
    })
    .withAutomaticReconnect().build();

    connection.on("NewMessage", onNewMessage);
    connection.on("GetChatMessages", onChatHistory);
    connection.on("Error", (error:string) => {
        console.error("SignalR Error: ", error);
    });

    return connection.start();
}

export async function sendMessage(receiverId:string, content:string) {
   if(!connection)  {
    throw new Error("SignalR connection not initialized");
   }
   await connection.invoke("SendMessageToUser");
}

export async function getChatHistory(userId:string){ 
    if (!connection) {
    throw new Error("SignalR connection not initialized");
    }
    await connection.invoke("GetChatMessages", userId);
}
