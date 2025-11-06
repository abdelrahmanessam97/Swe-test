import type { Category, CategoryDetailsResponse, CategoryDisplay, CategoryRoot } from "@/types/categories";
import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import homePageEndpoints from "@/utils/home/endPoints";
import productsPageEndpoints from "@/utils/products/endPoints";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface CategoriesState {
  categories: CategoryDisplay[];
  allCategories: Category[];
  rootCategories: CategoryRoot[];
  categoryDetails: CategoryDetailsResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  fetchRootCategories: (loadImage?: boolean) => Promise<void>;
  fetchSingleCategory: (categoryId: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoriesStore = create<CategoriesState & CategoriesActions>((set) => ({
  categories: [],
  allCategories: [],
  rootCategories: [],
  categoryDetails: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${homePageEndpoints.HomePageCategories}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoriesData: Category[] = data;

      // Transform the data to extract only the required fields
      const transformedCategories: CategoryDisplay[] = categoriesData.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category?.picture_model?.image_url || "/placeholder.webp",
      }));

      set({
        categories: transformedCategories,
        allCategories: categoriesData,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchRootCategories: async (loadImage = false) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetCategoriesRoot}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          loadImage: loadImage,
        },
      });
      const rootCategoriesData: CategoryRoot[] = data;

      set({
        rootCategories: rootCategoriesData,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch root categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchSingleCategory: async (categoryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const url = `${baseUrl}${productsPageEndpoints.GetSingleCategory.replace(":categoryId", String(categoryId))}`;
      const { data } = await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const details: CategoryDetailsResponse = data;
      set({ categoryDetails: details, isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch category details";
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));
