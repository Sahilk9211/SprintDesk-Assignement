// src/api/clients.ts
import axios from "axios";
import { attachAuthInterceptors } from "./interceptors";

export const mockClient = axios.create({ baseURL: "/" });

export const authClient = axios.create({ baseURL: "https://dummyjson.com" });

export const notificationClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Interceptors attached to clients that carry authenticated requests.
// authClient carries login/refresh too, but those calls don't send a
// Bearer token or trigger 401-refresh loops since they don't require auth.
attachAuthInterceptors(mockClient);
attachAuthInterceptors(authClient);
