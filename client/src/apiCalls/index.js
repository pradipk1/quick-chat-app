import axios from "axios";

export const rootUrl = 'https://quick-chat-app-server-eza8.onrender.com';

export const axiosInstance = axios.create({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
