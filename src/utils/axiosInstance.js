import axios from "axios";


// Set config defaults when creating the instance
export const instance = axios.create({
  baseURL: 'https://api.connectwyze.com',
  // baseURL: "http://localhost:3001",
  // timeout: 1000,
  headers: { 
    martech_token: "d96c0384e5dc5eec98e0a5febc93eaaeaf2b8049", 
    platform: 'tools' 
  },
});

const SET_AUTH_TOKEN = (token) => {
  if (token) {
    // Apply to every request
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
    localStorage.setItem("token", token);
  } else {
    // Delete auth header
    delete instance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

const GET = async (url, payload) => {
  const data = await instance.get(url, payload);
  return data.data;
};

const POST = async (url, payload) => {
  const data = await instance.post(url, payload);
  return data.data;
};

const PUT = async (url, payload) => {
  const data = await instance.put(url, payload);
  return data.data;
};

const DELETE = async (url, payload) => {
  const data = await instance.delete(url, payload);
  return data.data;
};

export { GET, POST, PUT, DELETE, SET_AUTH_TOKEN };
