import axios from "axios";
import Cookies from "js-cookie";
import * as signalR from "@microsoft/signalr";

interface UserProfileDTO {
  username: string;
  followersCount: number;
  followingCount: number;
  posts: PostDTO[];
  isOwnUserProfile: boolean;
}

interface PostDTO {
  id: number;
  description: string;
  createdDate: string;
}

interface Message {
  message: string;
}

const API_BASE_URL = "http://localhost:5226/api";
const SOCKET_BASE_URL = "http://localhost:5226";
let connection: signalR.HubConnection;

export async function connectToSignalR(
  onNewFollowerNotification?: (message: string) => void
) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${SOCKET_BASE_URL}/userHub`, {
      accessTokenFactory: () => Cookies.get("token") || "",
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

  if (onNewFollowerNotification) {
    connection.on("NewFollowerNotification", onNewFollowerNotification);
  }

  try {
    await connection.start();
    console.log("SignalR connected.");
  } catch (err) {
    console.error("SignalR connection error:", err);
  }
}

async function ensureConnection() {
  if (connection && connection.state !== signalR.HubConnectionState.Connected) {
    try {
      await connection.start();
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
      throw err;
    }
  }
}

export async function followUser(userToFollow: string) {
  await ensureConnection();
  if (
    !connection ||
    connection.state !== signalR.HubConnectionState.Connected
  ) {
    throw new Error(
      "SignalR connection not initialized or not in 'Connected' state"
    );
  }
  await connection.invoke("FollowUser", userToFollow);
}

export async function unfollowUser(userToUnfollow: string) {
  await ensureConnection();
  if (
    !connection ||
    connection.state !== signalR.HubConnectionState.Connected
  ) {
    throw new Error(
      "SignalR connection not initialized or not in 'Connected' state"
    );
  }
  await connection.invoke("UnfollowUser", userToUnfollow);
}

export async function getUserByUsername(username: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/User/GetUserByUsername/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile: " + error);
    throw error;
  }
}

export async function checkIfFollowing(username: string) {
  try {
    const token = Cookies.get("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(
      `${API_BASE_URL}/User/CheckIfUserIsFollowing/${username}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking if you are following this user.", error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const token = Cookies.get("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get<UserProfileDTO>(
      `${API_BASE_URL}/User/GetUserProfile`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
