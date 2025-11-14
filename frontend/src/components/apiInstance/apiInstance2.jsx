// lib/apiInstance.js or utils/apiInstance.js
import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 150000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiInstance;
