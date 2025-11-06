import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import addressEndpoints from "@/utils/address/endPoint";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

// ============================================================================
// TYPES
// ============================================================================

export interface Address {
  id: number;
  city: string;
  address1: string;
  phone_number: string;
  address2?: string;
  building_no?: string;
  apartment_no?: string;
  floor_no?: string;
}

export interface AddressFormData {
  label: string;
  phone: string;
  street: string;
  buildingNo?: string;
  apartmentNo?: string;
  floorNo?: string;
  details: string;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
}

interface AddressActions {
  fetchAddresses: () => Promise<void>;
  addAddress: (formData: AddressFormData) => Promise<boolean>;
  editAddress: (id: number, formData: AddressFormData) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<boolean>;
  clearError: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const handleApiError = (error: unknown, defaultMessage: string): string => {
  const err = error as AxiosError<{ message: string }>;
  return err.response?.data?.message || err.message || defaultMessage;
};

// Transform form data to API format
const transformFormDataToApi = (formData: AddressFormData): Address => {
  return {
    id: 0, // Will be set by API
    city: formData.details, // Using details as city
    address1: formData.street,
    phone_number: formData.phone,
    address2: formData.label, // Using label as address2
    building_no: formData.buildingNo,
    apartment_no: formData.apartmentNo,
    floor_no: formData.floorNo,
  };
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAddressStore = create<AddressState & AddressActions>((set, get) => ({
  // ============================================================================
  // INITIAL STATE
  // ============================================================================
  addresses: [],
  isLoading: false,
  error: null,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${addressEndpoints.allAddresses}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle different possible response structures
      let addresses = [];
      if (Array.isArray(data)) {
        addresses = data;
      } else if (data && Array.isArray(data.addresses)) {
        addresses = data.addresses;
      } else if (data && Array.isArray(data.data)) {
        addresses = data.data;
      } else if (data && data.model && Array.isArray(data.model.addresses)) {
        addresses = data.model.addresses;
      } else if (data && data.model && Array.isArray(data.model)) {
        addresses = data.model;
      }

      set({ addresses, isLoading: false });
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to fetch addresses");
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
    }
  },

  addAddress: async (formData: AddressFormData) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const apiData = transformFormDataToApi(formData);

      const requestBody = {
        model: {
          address: apiData,
        },
        form: {},
      };

      await axios.post(`${baseUrl}${addressEndpoints.addAddress}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await get().fetchAddresses();
      showToast("Address added successfully!", "success");
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to add address");
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
      return false;
    }
  },

  editAddress: async (id: number, formData: AddressFormData) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const apiData = transformFormDataToApi(formData);
      apiData.id = id;

      const requestBody = {
        id: id,
        model: {
          address: apiData,
        },
        form: {},
      };

      await axios.put(`${baseUrl}${addressEndpoints.editAddress}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Refresh addresses after successful edit

      await get().fetchAddresses();
      showToast("Address updated successfully!", "success");
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to update address");
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
      return false;
    }
  },

  deleteAddress: async (addressId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const url = addressEndpoints.deleteAddress.replace(":addressId", addressId.toString());

      await axios.delete(`${baseUrl}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh addresses after successful delete
      await get().fetchAddresses();
      showToast("Address deleted successfully!", "success");
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to delete address");
      set({ error: errorMessage, isLoading: false });
      showToast(errorMessage, "error");
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
