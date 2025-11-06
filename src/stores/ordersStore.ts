import type { OrderDetails, OrdersResponse, OrderSummary } from "@/types/orders";
import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import ordersEndpoints from "@/utils/order/endpoint";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface OrdersState {
  orders: OrderSummary[];
  isLoading: boolean;
  error: string | null;
  orderDetails: Record<number, OrderDetails | undefined>;
}

interface OrdersActions {
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: number) => Promise<void>;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersState & OrdersActions>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  orderDetails: {},

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get<OrdersResponse>(`${baseUrl}${ordersEndpoints.getOrder}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ orders: data.orders, isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Failed to load orders";
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  fetchOrderDetails: async (orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const { data } = await axios.get<OrderDetails>(`${baseUrl}${ordersEndpoints.orderDetails}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ orderDetails: { ...get().orderDetails, [orderId]: data }, isLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Failed to load order details";
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  clearError: () => set({ error: null }),
}));
