import authEndpoints from "@/utils/auth/endPoints";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TwoFactorStatus {
  IsSetup: boolean;
  RequiresSetup: boolean;
  Message?: string;
}

interface QRSetupData {
  Success: boolean;
  SecretKey: string;
  QrCodeBase64: string;
  ManualKey: string;
  Instructions: string;
  Message: string;
}

interface VerifyLoginResponse {
  Success: boolean;
  Message: string;
  Token: string;
}

interface VerifySetupResponse {
  Success: boolean;
  Message: string;
  Token: string;
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isUserLoggedIn: boolean;
  isTwoFactorSetup: boolean;
  requiresTwoFactorSetup: boolean;
  twoFactorMessage: string | null;
  customerId: string | null;
  qrSetupData: QRSetupData | null;
}

type ApiErrorArray = string[];
interface ApiErrorObject {
  Message?: string;
  message?: string;
  Errors?: string[];
  errors?: string[];
}

type ApiErrorData = ApiErrorArray | ApiErrorObject | undefined;

function isApiErrorObject(data: ApiErrorData): data is ApiErrorObject {
  return !!data && !Array.isArray(data) && typeof data === "object";
}

interface AuthActions {
  register: (payload: {
    model: {
      first_name: string;
      last_name: string;
      Username: string;
      email: string;
      password: string;
      confirm_password: string;
      phone_enabled: boolean;
      phone_required: boolean;
      phone: string;
    };
    form: Record<string, unknown>;
  }) => Promise<boolean>;
  login: (payload: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkFactorStatus: () => Promise<TwoFactorStatus | null>;
  setupTwoFactor: () => Promise<QRSetupData | null>;
  verifyLogin: (code: string) => Promise<boolean>;
  verifySetup: (code: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      isUserLoggedIn: false,
      isTwoFactorSetup: false,
      requiresTwoFactorSetup: false,
      twoFactorMessage: null,
      customerId: null,
      qrSetupData: null,

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const token = await getAuthToken();
          await axios.post(`${baseUrl}${authEndpoints.register}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          showToast("Registration successful", "success");
          return true;
        } catch (error) {
          const err = error as AxiosError<ApiErrorData>;
          const data = err.response?.data;
          let message = "Registration failed";
          if (Array.isArray(data) && data.length > 0) {
            message = data.join(", ");
          } else if (isApiErrorObject(data)) {
            if (Array.isArray(data.Errors) && data.Errors.length > 0) {
              message = data.Errors.join(", ");
            } else if (Array.isArray(data.errors) && data.errors.length > 0) {
              message = data.errors.join(", ");
            } else if (data.Message || data.message) {
              message = data.Message || data.message || message;
            }
          }
          showToast(message, "error");
          set({ error: message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(`${baseUrl}${authEndpoints.login}`, {
            is_guest: false,
            email,
            password,
          });

          const token = (data && (data.token || data.Token || data.access_token)) as string | undefined;

          if (token) {
            setAuthToken(token);
          }
          // Store customer id in state if provided by login response
          if (data && (data.customer_id ?? data.CustomerId ?? data.customerId)) {
            const cid = String(data.customer_id ?? data.CustomerId ?? data.customerId);
            set({ customerId: cid });
            // Check two-factor status after setting customer ID
            try {
              await get().checkFactorStatus();
            } catch (e) {
              console.error("Failed to check factor status", e);
            }
          }
          set({ isUserLoggedIn: true });
          return true;
        } catch (error) {
          const err = error as AxiosError<ApiErrorData>;
          const resp = err.response?.data;
          let message = "Login failed";
          if (Array.isArray(resp) && resp.length > 0) {
            message = resp.join(", ");
          } else if (isApiErrorObject(resp)) {
            if (Array.isArray(resp.Errors) && resp.Errors.length > 0) {
              message = resp.Errors.join(", ");
            } else if (Array.isArray(resp.errors) && resp.errors.length > 0) {
              message = resp.errors.join(", ");
            } else if (resp.Message || resp.message) {
              message = resp.Message || resp.message || message;
            }
          }
          showToast(message, "error");
          set({ error: message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = await getAuthToken();
          await axios.get(`${baseUrl}${authEndpoints.logout}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          clearAuthToken();
          set({ isUserLoggedIn: false, customerId: null, qrSetupData: null });
          showToast("Logged out successfully", "success");
        } catch (error) {
          console.error("Logout error:", error);
          clearAuthToken();
          set({ isUserLoggedIn: false, customerId: null, qrSetupData: null });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      checkFactorStatus: async () => {
        try {
          const token = await getAuthToken();
          const customerId = get().customerId;

          if (!customerId) {
            console.error("Customer ID not found in state");
            return null;
          }

          const { data } = await axios.get<TwoFactorStatus>(`${baseUrl}${authEndpoints.factorStatus}?customerId=${customerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({
            isTwoFactorSetup: data.IsSetup,
            requiresTwoFactorSetup: data.RequiresSetup,
            twoFactorMessage: data.Message || null,
          });

          // If IsSetup is false, fetch QR setup data
          if (!data.IsSetup) {
            await get().setupTwoFactor();
          }

          return data;
        } catch (error) {
          console.error("Error checking two-factor status:", error);
          return null;
        }
      },

      setupTwoFactor: async () => {
        try {
          const token = await getAuthToken();
          const customerId = get().customerId;

          if (!customerId) {
            console.error("Customer ID not found in state");
            return null;
          }

          const { data } = await axios.post<QRSetupData>(
            `${baseUrl}${authEndpoints.factorSetup}`,
            { customerId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          set({ qrSetupData: data });

          return data;
        } catch (error) {
          console.error("Error setting up two-factor authentication:", error);
          return null;
        }
      },

      verifyLogin: async (code: string) => {
        try {
          const token = await getAuthToken();
          const customerId = get().customerId;

          if (!customerId) {
            console.error("Customer ID not found in state");
            return false;
          }

          const { data } = await axios.post<VerifyLoginResponse>(
            `${baseUrl}${authEndpoints.verifyLogin}`,
            { customerId, code },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data.Success && data.Token) {
            setAuthToken(data.Token);
            showToast("Logged in successfully", "success");
            return true;
          } else {
            showToast(data.Message || "Invalid OTP. Please try again.", "error");
            return false;
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          showToast("Invalid OTP. Please try again.", "error");
          return false;
        }
      },

      verifySetup: async (code: string) => {
        try {
          const token = await getAuthToken();
          const customerId = get().customerId;

          if (!customerId) {
            console.error("Customer ID not found in state");
            return false;
          }

          const { data } = await axios.post<VerifySetupResponse>(
            `${baseUrl}${authEndpoints.verifySetup}`,
            { customerId, code },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data.Success) {
            setAuthToken(data.Token);
            showToast("Logged in successfully", "success");
            return true;
          } else {
            showToast(data.Message || "Invalid OTP. Please try again.", "error");
            return false;
          }
        } catch (error) {
          console.error("Error verifying setup OTP:", error);
          showToast("Invalid OTP. Please try again.", "error");
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoading: state.isLoading,
        error: state.error,
        isUserLoggedIn: state.isUserLoggedIn,
      }),
    }
  )
);
