import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import privacyEndpoints from "@/utils/privacy/endpoints";
import axios from "axios";
import { create } from "zustand";

interface PrivacyData {
  title: string;
  body: string;
}

interface PrivacyState {
  data: PrivacyData | null;
  isLoading: boolean;
  error: string | null;
  fetchPrivacy: (systemName?: string) => Promise<void>;
}

export const usePrivacyStore = create<PrivacyState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchPrivacy: async (systemName = "PrivacyInfo") => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const res = await axios.get(`${baseUrl}${privacyEndpoints.getPrivacy}`, {
        params: { systemName },
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        data: {
          title: res.data.title || "Privacy Policy",
          body: res.data.body || "",
        },
        isLoading: false,
      });
    } catch {
      set({ error: "Failed to load privacy info", isLoading: false });
    }
  },
}));
