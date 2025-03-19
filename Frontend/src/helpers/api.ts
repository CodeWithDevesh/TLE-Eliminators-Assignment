import axios from "axios";

const server = import.meta.env.VITE_SERVER_URL;

export const api = axios.create({baseURL: server, withCredentials: true});