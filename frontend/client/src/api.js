import axios from "axios";
const API_BASE = "http://localhost:4000/api";

export const api = (token) =>
  axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
