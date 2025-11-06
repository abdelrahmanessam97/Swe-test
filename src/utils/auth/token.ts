import Cookies from "js-cookie";
import { baseUrl } from "../baseUrl";

type GuestTokenResponse = {
  token?: string;
  customer_id?: string | number;
  // other fields may exist but are not used here
  [key: string]: unknown;
};

/**
 * Request new guest token from API
 */
export const fetchGuestToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${baseUrl}/api-frontend/Authenticate/GetToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_guest: true }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch guest token");
    }

    const data: GuestTokenResponse | string = await response.json();
    const token = typeof data === "object" && data?.token ? data.token : (data as string); // adjust based on API response shape

    if (token) {
      setGuestToken(token);
      return token;
    }

    throw new Error("Token missing in response");
  } catch (error) {
    console.error("Error fetching guest token:", error);
    throw error;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async (): Promise<string> => {
  const userToken = Cookies.get("auth_token");
  if (userToken) return userToken;
  const guestToken = Cookies.get("guest_token");
  if (guestToken) return guestToken;
  return await fetchGuestToken();
};

/**
 * Save token
 */
export const setAuthToken = (token: string, expiryDays: number = 7): void => {
  Cookies.set("auth_token", token, { expires: expiryDays });
  // Ensure guest token is not kept alongside real auth token
  Cookies.remove("guest_token");
};

/**
 * Save guest token
 */
export const setGuestToken = (token: string, expiryDays: number = 7): void => {
  Cookies.set("guest_token", token, { expires: expiryDays });
};

/**
 * Clear token
 */
export const clearAuthToken = (): void => {
  Cookies.remove("auth_token");
  Cookies.remove("guest_token");
};

/**
 * Check authentication
 */
export const isAuthenticated = (): boolean => {
  // Only treat real user token as authenticated, not guest token
  return !!Cookies.get("auth_token");
};
