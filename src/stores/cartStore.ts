import type { CartItem, CartItemRaw } from "@/types/cart";
import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import cartPageEndpoints from "@/utils/cart/endPoint";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_IMAGE = "/default-image.png";

// ============================================================================
// TYPES
// ============================================================================

interface ProductAttribute {
  attributeId: number;
  valueId: number;
}

type ShoppingCartType = "ShoppingCart" | "Wishlist";
type CartAction = "update" | "remove";

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  updatingItemId: number | null;
  removingItemId: number | null;
  error: string | null;
  subtotal: number;
  discount: number;
  total: number;
}

interface CartActions {
  // Core cart operations
  fetchCartItems: (silent?: boolean) => Promise<void>;
  addToCart: (productId: number, quantity: number, productAttributes?: ProductAttribute[]) => Promise<void>;
  addToWishlist: (productId: number, quantity: number, productAttributes?: ProductAttribute[]) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;

  // Internal operations
  updateOrDeleteCartItem: (itemId: number, action: CartAction, newQuantity?: number) => Promise<void>;
  addToCartOrWishlist: (shoppingCartType: ShoppingCartType, productId: number, quantity: number, productAttributes?: ProductAttribute[]) => Promise<void>;
  calculateTotals: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const transformCartItems = (items: CartItemRaw[]): CartItem[] => {
  return items.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name,
    image_url: item.picture?.image_url || DEFAULT_IMAGE,
    unit_price: item.unit_price, // keep string for display
    sub_total: item.sub_total, // keep string for UI
    discount: item.discount, // keep string for UI
    quantity: item.quantity,
    // add numeric values for calculations
    _unit_price_value: item.unit_price_value,
    _sub_total_value: item.sub_total_value,
    _discount_value: item.discount_value,
  })) as CartItem[];
};
const handleApiError = (error: unknown, defaultMessage: string): string => {
  const err = error as AxiosError<{ message: string }>;
  return err.response?.data?.message || err.message || defaultMessage;
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  // ============================================================================
  // INITIAL STATE
  // ============================================================================
  cartItems: [],
  isLoading: false,
  updatingItemId: null,
  removingItemId: null,
  error: null,
  subtotal: 0,
  discount: 0,
  total: 0,

  // ============================================================================
  // CORE CART OPERATIONS
  // ============================================================================

  fetchCartItems: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, error: null });
    } else {
      set({ error: null });
    }

    try {
      const token = await getAuthToken();
      const { data } = await axios.get<{ items: CartItemRaw[] }>(`${baseUrl}${cartPageEndpoints.GetCartItems}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle empty or invalid cart data
      if (!data.items || !Array.isArray(data.items)) {
        set({
          cartItems: [],
          ...(!silent && { isLoading: false }),
        });
        return;
      }

      // Transform and set cart items
      const transformedCartItems = transformCartItems(data.items);
      set({
        cartItems: transformedCartItems,
        ...(!silent && { isLoading: false }),
      });

      // Calculate totals after setting cart items
      get().calculateTotals();
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to fetch cart items");
      set({
        error: errorMessage,
        ...(!silent && { isLoading: false }),
      });
    }
  },

  addToCart: async (productId: number, quantity: number, productAttributes: ProductAttribute[] = []) => {
    await get().addToCartOrWishlist("ShoppingCart", productId, quantity, productAttributes);
  },

  addToWishlist: async (productId: number, quantity: number, productAttributes: ProductAttribute[] = []) => {
    await get().addToCartOrWishlist("Wishlist", productId, quantity, productAttributes);
  },

  updateQuantity: async (productId: number, quantity: number) => {
    const { cartItems } = get();
    const item = cartItems.find((item) => item.product_id === productId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    // Set updating state for this specific item
    set({ updatingItemId: productId });

    try {
      // If quantity is 0 or negative, remove the item
      if (quantity <= 0) {
        await get().updateOrDeleteCartItem(item.id, "remove");
      } else {
        await get().updateOrDeleteCartItem(item.id, "update", quantity);
      }
    } finally {
      // Clear updating state
      set({ updatingItemId: null });
    }
  },

  removeItem: async (productId: number) => {
    const { cartItems } = get();
    const item = cartItems.find((item) => item.product_id === productId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    // Set removing state for this specific item
    set({ removingItemId: productId });

    try {
      await get().updateOrDeleteCartItem(item.id, "remove");
    } finally {
      // Clear removing state
      set({ removingItemId: null });
    }
  },

  // ============================================================================
  // INTERNAL OPERATIONS
  // ============================================================================

  calculateTotals: () => {
    const { cartItems } = get();
    const subtotal = cartItems.reduce((sum, item) => sum + item._sub_total_value, 0);
    const discount = cartItems.reduce((sum, item) => sum + item._discount_value, 0);
    const total = subtotal - discount;

    set({ subtotal, discount, total });
  },

  updateOrDeleteCartItem: async (itemId: number, action: CartAction, newQuantity?: number) => {
    set({ error: null });

    try {
      const { cartItems } = get();

      // Build request body according to API specification
      const requestBody: Record<string, string> = {
        removefromcart: "", // Always required, empty string for update operations
      };

      if (action === "remove") {
        requestBody.removefromcart = itemId.toString();
        // Include all other cart items with their current quantities
        cartItems.forEach((item) => {
          if (item.id !== itemId) {
            // Set current quantity for items that are NOT being removed
            requestBody[`itemquantity${item.id}`] = item.quantity.toString();
          }
        });
      } else if (action === "update" && newQuantity !== undefined) {
        // Include all cart items with their current quantities
        cartItems.forEach((item) => {
          if (item.id === itemId) {
            // Set the new quantity for the item being updated
            requestBody[`itemquantity${item.id}`] = newQuantity.toString();
          } else {
            // Set current quantity for other items
            requestBody[`itemquantity${item.id}`] = item.quantity.toString();
          }
        });
      } else {
        throw new Error("Invalid action or missing quantity for update");
      }

      const token = await getAuthToken();
      const { data } = await axios.post(`${baseUrl}${cartPageEndpoints.UpdateOrDeleteForCartItems}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle API error response
      if (data.success === false) {
        const errorMessages = data.errors || [];
        const errorMessage = errorMessages.length > 0 ? errorMessages[0] : `Failed to ${action} cart item`;

        showToast(errorMessage, "error");
        throw new Error(errorMessage);
      }

      // Show success message
      const successMessage = action === "remove" ? "Item removed from cart successfully!" : "Cart item updated successfully!";

      showToast(successMessage, "success");

      // Refresh cart items silently after successful operation
      await get().fetchCartItems(true);
    } catch (error) {
      const errorMessage = handleApiError(error, `Failed to ${action} cart item`);
      set({
        error: errorMessage,
      });
    }
  },

  addToCartOrWishlist: async (shoppingCartType: ShoppingCartType, productId: number, quantity: number, productAttributes: ProductAttribute[] = []) => {
    set({ isLoading: true, error: null });

    try {
      // Build request body
      const requestBody: Record<string, string> = {
        [`addtocart_${productId}.EnteredQuantity`]: quantity.toString(),
      };

      // Add product attributes
      productAttributes.forEach((attr) => {
        if (attr.attributeId !== undefined && attr.valueId !== undefined) {
          requestBody[`product_attribute_${attr.attributeId}`] = attr.valueId.toString();
        }
      });

      // Build URL with query parameters
      const params = new URLSearchParams({ shoppingCartType });
      const apiUrl = `${baseUrl}${cartPageEndpoints.AddCartItemsFromDetails}/${productId}?${params}`;

      const token = await getAuthToken();
      const { data } = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle API error response
      if (data.success === false) {
        const errorMessages = data.errors || [];
        const errorMessage = errorMessages.length > 0 ? errorMessages[0] : `Failed to add to ${shoppingCartType.toLowerCase()}`;

        showToast(errorMessage, "error");
        set({ isLoading: false });
        throw new Error(errorMessage);
      }

      // Show success message
      const successMessage = `Product added to ${shoppingCartType === "ShoppingCart" ? "cart" : "wishlist"} successfully!`;
      showToast(successMessage, "success");

      // Refresh cart items silently if adding to shopping cart
      if (shoppingCartType === "ShoppingCart") {
        await get().fetchCartItems(true);
      }

      set({ isLoading: false });
    } catch (error) {
      const errorMessage = handleApiError(error, `Failed to add to ${shoppingCartType.toLowerCase()}`);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },
}));
