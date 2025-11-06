import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import profileEndpoints from "@/utils/profile/endpoint";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface ProfileInfoState {
  info: unknown | null;
  isLoading: boolean;
  error: string | null;
  fetchInfo: () => Promise<void>;
  updateInfo: (data: { email: string; first_name: string; last_name: string; phone: string }) => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileInfoState>((set) => ({
  info: null,
  isLoading: false,
  error: null,

  fetchInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${profileEndpoints.Info}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ info: data });
    } catch (error) {
      const err = error as AxiosError<{ message?: string; Message?: string }>;
      const errorMessage = err.response?.data?.Message || err.response?.data?.message || "Failed to load profile info";
      set({ error: errorMessage });
      showToast(errorMessage, "error");
    } finally {
      set({ isLoading: false });
    }
  },

  updateInfo: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      await axios.post(
        `${baseUrl}${profileEndpoints.editInfo}`,
        {
          model: data,
          form: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refetch updated info
      const { data: updatedData } = await axios.get(`${baseUrl}${profileEndpoints.Info}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ info: updatedData });
      showToast("Profile updated successfully", "success");
    } catch (error) {
      const err = error as AxiosError<{ message?: string; Message?: string }>;
      const errorMessage = err.response?.data?.Message || err.response?.data?.message || "Failed to update profile info";
      set({ error: errorMessage });
      showToast(errorMessage, "error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
