import axios from "axios";
// Set config defaults when creating the instance
export const instance = axios.create({
  baseURL: 'https://carso.me',
  // baseURL: "http://localhost:3001",
  // timeout: 1000,
  headers: { martech_token: "e5246b1bdaa7c2b1cc3d8f0e65f4c7bec26c3936", platform:'tools' },
});

// Alter defaults after instance has been created
//   instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

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
