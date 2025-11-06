import { useCartStore } from "@/stores/cartStore";
import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import checkoutEndpoints from "@/utils/checkout/endPoints";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

// ============================================================================
// TYPES
// ============================================================================

export interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  company_enabled: boolean;
  company_required: boolean;
  company: string;
  country_enabled: boolean;
  country_id: number;
  country_name: string;
  state_province_enabled: boolean;
  state_province_id: number;
  state_province_name: string;
  county_enabled: boolean;
  county_required: boolean;
  county: string;
  city_enabled: boolean;
  city_required: boolean;
  city: string;
  street_address_enabled: boolean;
  street_address_required: boolean;
  address1: string;
  street_address2_enabled: boolean;
  street_address2_required: boolean;
  address2: string;
  phone_enabled: boolean;
  phone_required: boolean;
  phone_number: string;
}

export interface CheckoutPayload {
  model: {
    billing_new_address: BillingAddress;
    ship_to_same_address: boolean;
  };
  form: Record<string, never>;
}

interface ConfirmOrderResponse {
  model: null;
  redirect_to_method: string;
  id: number;
}

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  billingAddress: BillingAddress | null;
  success: boolean;
  orderCompleted: boolean;
  orderId: number | null;
}

interface CheckoutActions {
  submitBillingAddress: (payload: CheckoutPayload) => Promise<void>;
  selectShippingMethod: () => Promise<void>;
  selectPaymentMethod: () => Promise<void>;
  confirmOrder: () => Promise<ConfirmOrderResponse | undefined>;
  clearError: () => void;
  reset: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// ============================================================================
// STORE
// ============================================================================

export const useCheckoutStore = create<CheckoutState & CheckoutActions>((set) => ({
  // State
  isLoading: false,
  error: null,
  billingAddress: null,
  success: false,
  orderCompleted: false,
  orderId: null,

  // Actions
  submitBillingAddress: async (payload: CheckoutPayload) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const token = await getAuthToken();

      const response = await axios.post(`${baseUrl}${checkoutEndpoints.NewBillingAddress}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      set({
        isLoading: false,
        billingAddress: payload.model.billing_new_address,
        success: true,
        error: null,
      });

      // Call selectShippingMethod after 2 seconds
      setTimeout(() => {
        useCheckoutStore.getState().selectShippingMethod();
      }, 2000);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to save billing address";

      set({
        isLoading: false,
        error: errorMessage,
        success: false,
      });

      showToast(errorMessage, "error");

      throw error;
    }
  },

  selectShippingMethod: async () => {
    try {
      const token = await getAuthToken();

      const response = await axios.post(
        `${baseUrl}${checkoutEndpoints.selectShippingMethod}`,
        {
          PickupInStore: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to select shipping method";

      showToast(errorMessage, "error");

      console.error("Shipping method selection error:", error);
    }
  },

  selectPaymentMethod: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();

      const response = await axios.post(
        `${baseUrl}${checkoutEndpoints.selectPaymentMethod}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      set({ isLoading: false });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to confirm payment method";

      set({
        isLoading: false,
        error: errorMessage,
      });

      showToast(errorMessage, "error");

      throw error;
    }
  },

  confirmOrder: async () => {
    set({ isLoading: true, error: null, orderCompleted: false });

    try {
      const token = await getAuthToken();

      const response = await axios.post<ConfirmOrderResponse>(
        `${baseUrl}${checkoutEndpoints.confirmOrder}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { redirect_to_method, id } = response.data;

      if (redirect_to_method === "Completed") {
        set({
          isLoading: false,
          orderCompleted: true,
          orderId: id,
          error: null,
        });

        showToast(`Order completed successfully!`, "success", { duration: 4000 });

        // Refresh cart items after successful order completion
        try {
          await useCartStore.getState().fetchCartItems(true);
        } catch {
          // ignore refresh errors to avoid masking order success
        }
      }

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to confirm order";

      set({
        isLoading: false,
        error: errorMessage,
        orderCompleted: false,
      });

      showToast(errorMessage, "error");

      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      isLoading: false,
      error: null,
      billingAddress: null,
      success: false,
      orderCompleted: false,
      orderId: null,
    }),
}));
