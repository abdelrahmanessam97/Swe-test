import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import homePageEndpoints from "@/utils/home/endPoints";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

// Types for API responses
export interface SwiperCTA {
  id: number;
  label: string;
  url: string;
  visible: boolean;
}

export interface SwiperItem {
  id: number;
  picture_id: number;
  picture_url: string;
  title: string;
  description: string;
  replace_ctas: unknown;
  ctas: SwiperCTA[];
  display_order: number;
  active: boolean;
  media_type: string;
  video_url: string | null;
}

export interface SwiperResponse {
  success: boolean;
  message: string;
  data: SwiperItem[];
  error_code: string | null;
}

export interface FeatureItem {
  Id: number;
  Title: string;
  PictureId: number;
  PictureUrl: string;
  Link?: string;
  DisplayOrder?: number;
}

export interface FeaturesResponse {
  success: boolean;
  message: string;
  data: FeatureItem[];
  error_code: string | null;
}

interface HomeState {
  swiperItems: SwiperItem[];
  features: FeatureItem[];
  isLoading: boolean;
  error: string | null;
}

interface HomeActions {
  fetchSwiper: () => Promise<void>;
  fetchFeatures: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useHomeStore = create<HomeState & HomeActions>((set) => ({
  swiperItems: [],
  features: [],
  isLoading: false,
  error: null,

  fetchSwiper: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get<SwiperResponse>(`${baseUrl}${homePageEndpoints.HomeSwiper}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ swiperItems: data.data, isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch swiper data";
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  fetchFeatures: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get<FeaturesResponse>(`${baseUrl}${homePageEndpoints.HomeFeatures}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ features: data.data, isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch features data";
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));
