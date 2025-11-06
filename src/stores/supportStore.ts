import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import supportEndpoints from "@/utils/support/endPoints";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface SupportState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  sendEnquiry: (data: { full_name: string; phone_number: string; email: string; enquiry: string }) => Promise<void>;
  reset: () => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  isLoading: false,
  error: null,
  success: false,

  sendEnquiry: async (data) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const token = await getAuthToken();
      await axios.post(`${baseUrl}${supportEndpoints.sendToSupport}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ success: true });
      showToast("Message sent successfully", "success");
    } catch (err) {
      let message = "Something went wrong";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string; Message?: string }>;
        message = axiosError.response?.data?.Message || axiosError.response?.data?.message || message;
      }
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ isLoading: false, error: null, success: false }),
}));
