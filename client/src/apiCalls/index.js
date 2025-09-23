import axios from "axios";

export const rootUrl = 'http://localhost:5000';

export const axiosInstance = axios.create({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
