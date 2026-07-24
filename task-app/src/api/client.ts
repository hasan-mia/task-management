import axios from "axios";

declare const process: {
  env: {
    API_URL?: string;
  };
};

const resolved =
  process.env.API_URL ||
  "http://localhost:3001";

export const API_BASE_URL = resolved;

console.log("🚀 API BASE URL:", API_BASE_URL);

if (API_BASE_URL.includes("localhost")) {
  console.warn(
    "Warning: API_BASE_URL uses localhost. This will NOT work from an Android emulator/device. " +
    "Update .env to use your machine's LAN IP (e.g. http://192.168.1.100:3001) or 10.0.2.2 for Android emulator."
  );
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  console.log(
    "API REQUEST:",
    config.method?.toUpperCase(),
    `${config.baseURL}${config.url}`
  );
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", response.status, response.config.url);
    return response;
  },
  (error) => {
    const url = error.config?.url;
    console.log("API ERROR URL:", url);
    console.log("API ERROR STATUS:", error.response?.status);
    console.log("API ERROR DATA:", error.response?.data);

    if (!error.response) {
      console.warn("Network error - server unreachable. Check that .env API_URL points to your machine's LAN IP, not localhost.");
    }

    return Promise.reject(error);
  }
);
