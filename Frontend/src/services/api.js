import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictRisk = async (payload) => {
  const response = await API.post("/predict", payload);
  return response.data;
};

