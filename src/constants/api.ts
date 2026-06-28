import axios from 'axios';

// Use your computer's local IP, not "localhost" — phones can't reach "localhost"
// Find your IP: Windows → run "ipconfig" → look for IPv4 Address
export const API_URL = 'http://192.168.101.6:3000'; // ← replace XXX with your actual IP

export const api = axios.create({ baseURL: API_URL });