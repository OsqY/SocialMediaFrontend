import axios from 'axios';
import Cookies from 'js-cookie';
import { headers } from 'next/headers';

const API_BASE_URL = 'http://localhost:5226/api';

export async function getUserByUsername(username:string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/User/GetUserByUsername/${username}`);
        return response;
    }catch(error) {
        console.error('Error fetching profile: '+ error);
        throw error;
    }
}

export async function getUserProfile(username: string) {
  try {
    const token = Cookies.get('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get<UserProfileDTO>(`${API_BASE_URL}/User/GetUserByUsername/${username}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

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