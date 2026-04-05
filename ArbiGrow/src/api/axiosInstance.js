import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",

    accept: "application/json",
  },
  withCredentials: true,
});
// console.log("From axios file", import.meta.env);
// console.log("From axios file", import.meta.env.VITE_BACKEND_URL);

export default api;
