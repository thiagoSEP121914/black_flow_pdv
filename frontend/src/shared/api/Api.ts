import axios, { type AxiosInstance } from "axios";

class Api {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  get instance() {
    return this.client;
  }
}

const api = new Api().instance;
export default api;
