import axios from "axios";


export const getAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
});

export const CreateEventAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});