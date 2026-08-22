// src/hooks/useToast.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "./useToast";
import { useToastStore } from "../stores/toastStore";

describe("useToast", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  it("adds a toast with the correct type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success("Task created");
    });

    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]).toMatchObject({
      message: "Task created",
      type: "success",
    });
  });

  it("auto-dismisses the toast after 4 seconds", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info("Hello");
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
