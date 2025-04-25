"use client";

import { useState, useEffect } from "react";

/**
 * A hook that returns true when the component is mounted on the client.
 * Use this to safely render client-only content and avoid hydration errors.
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * A hook that returns the window object only when on the client.
 * Use this to safely access window properties and avoid hydration errors.
 */
export function useWindow<T>(getter: () => T, fallback: T): T {
  const isClient = useClientOnly();
  
  if (!isClient) {
    return fallback;
  }
  
  return getter();
}

/**
 * A hook that returns the current date only when on the client.
 * Use this to safely format dates and avoid hydration errors.
 */
export function useClientDate(): Date | null {
  const isClient = useClientOnly();
  
  if (!isClient) {
    return null;
  }
  
  return new Date();
}