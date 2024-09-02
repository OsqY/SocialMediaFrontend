import axios from 'axios';
import Cookies from 'js-cookie';
import * as signalR from '@microsoft/signalr'


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

const API_BASE_URL = 'http://localhost:5226/api';
let connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE_URL}/userHub`).build();

export async function connectToSignalR(onNewFollowerMessage : (Message :string) => void) {
  connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE_URL}/userHub`,{
    accessTokenFactory: () => Cookies.get('token') || '',
  }).withAutomaticReconnect().build();

  connection.on("NewFollower", (message) => onNewFollowerMessage);
  connection.on("Error", (message) => console.log(message));
}

export async function getUserByUsername(username:string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/User/GetUserByUsername/${username}`);
        return response.data;
    }catch(error) {
        console.error('Error fetching profile: '+ error);
        throw error;
    }
}

export async function getUserProfile() {
  try {
    const token = Cookies.get('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get<UserProfileDTO>(`${API_BASE_URL}/User/GetUserProfile`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function follorOrUnfollowUser(userToFollow:string, isFollowing:boolean) {
  if (!connection) {
    throw new Error("SignalR connection not initialized");
  }
  await connection.invoke("FollowOrUnfollowUser", userToFollow, isFollowing);
}