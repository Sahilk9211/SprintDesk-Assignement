import axios from "axios";
import { attachAuthInterceptors } from "./interceptors";

export const mockClient = axios.create({ baseURL: "/" });

export const authClient = axios.create({ baseURL: "https://dummyjson.com" });

export const notificationClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

attachAuthInterceptors(mockClient);
attachAuthInterceptors(authClient);
