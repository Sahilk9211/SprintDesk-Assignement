// src/api/interceptors.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { attachAuthInterceptors } from "./interceptors";
import { useAuthStore } from "../stores/authStore";
import * as authService from "./authService";

describe("auth interceptor", () => {
  let client: ReturnType<typeof axios.create>;
  let mock: MockAdapter;

  beforeEach(() => {
    client = axios.create({ baseURL: "https://test.local" });
    mock = new MockAdapter(client);
    attachAuthInterceptors(client);

    useAuthStore.setState({
      user: null,
      accessToken: "expired-token",
      refreshToken: "valid-refresh-token",
      isAuthenticated: true,
      isInitializing: false,
    });
  });

  it("attaches the Bearer token to outgoing requests", async () => {
    mock.onGet("/ping").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer expired-token");
      return [200, { ok: true }];
    });

    await client.get("/ping");
  });

  it("refreshes the token on 401 and retries the original request", async () => {
    vi.spyOn(authService, "refreshTokenRequest").mockResolvedValue({
      accessToken: "new-token",
      refreshToken: "new-refresh-token",
    });

    let callCount = 0;
    mock.onGet("/protected").reply(() => {
      callCount++;
      if (callCount === 1) return [401];
      return [200, { data: "success" }];
    });

    const response = await client.get("/protected");

    expect(callCount).toBe(2); // failed once, succeeded on retry
    expect(response.data).toEqual({ data: "success" });
    expect(useAuthStore.getState().accessToken).toBe("new-token");
  });

  it("clears auth if refresh fails", async () => {
    vi.spyOn(authService, "refreshTokenRequest").mockRejectedValue(
      new Error("refresh failed"),
    );
    mock.onGet("/protected").reply(401);

    await expect(client.get("/protected")).rejects.toThrow();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
