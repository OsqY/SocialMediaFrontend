import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5226/api';

export async function loginUser(username: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/Login`, {
      username,
      password,
      
    });
    const token = response.data;
    console.log(token);
    Cookies.set('token', token, { expires: 1/96  }); 
    return token;
  } catch (error) {
    throw new Error('Login failed');
  }
}

export async function registerUser(username: string, email: string, password: string) {
  try {
    console.log(username)
    const response = await axios.post(`${API_BASE_URL}/User/RegisterUser`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }

}
  export async function LogoutUser() {
    try {
        const token = Cookies.get('token');

        if (token) {
            await axios.post(`${API_BASE_URL}/User/Logout`, {},

                {
                    headers: {Authorization: `Bearer ${token}`}
                }

            )
        }
    }
    catch(error) {
        console.error('Logout failed!', error);
    }
    finally{
        Cookies.remove('token');
    }
  }