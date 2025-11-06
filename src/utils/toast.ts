import toast from "react-hot-toast";

// ============================================================================
// TOAST CONFIGURATION
// ============================================================================

export const TOAST_STYLES = {
  success: {
    background: "white",
    color: "hsl(var(--primary))",
    border: "2px solid hsl(var(--primary))",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
  },
  error: {
    background: "white",
    color: "hsl(var(--destructive))",
    border: "2px solid hsl(var(--destructive))",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
  },
  warning: {
    background: "white",
    color: "hsl(var(--warning))",
    border: "2px solid hsl(var(--warning))",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
  },
  info: {
    background: "white",
    color: "hsl(var(--info))",
    border: "2px solid hsl(var(--info))",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
  },
} as const;

export const TOAST_CONFIG = {
  duration: 1000,
  position: "top-right" as const,
};

// ============================================================================
// TOAST TYPES
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  style?: React.CSSProperties;
}

// ============================================================================
// TOAST FUNCTIONS
// ============================================================================

/**
 * Show a success toast notification
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    style: TOAST_STYLES.success,
    ...TOAST_CONFIG,
    ...options,
  });
};

/**
 * Show an error toast notification
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    style: TOAST_STYLES.error,
    ...TOAST_CONFIG,
    ...options,
  });
};

/**
 * Show a warning toast notification
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    icon: "⚠️",
    style: TOAST_STYLES.warning,
    ...TOAST_CONFIG,
    ...options,
  });
};

/**
 * Show an info toast notification
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    icon: "ℹ️",
    style: TOAST_STYLES.info,
    ...TOAST_CONFIG,
    ...options,
  });
};

/**
 * Generic toast function that accepts a type parameter
 */
export const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  switch (type) {
    case "success":
      return showSuccessToast(message, options);
    case "error":
      return showErrorToast(message, options);
    case "warning":
      return showWarningToast(message, options);
    case "info":
      return showInfoToast(message, options);
    default:
      return showInfoToast(message, options);
  }
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// ============================================================================
// CONVENIENCE FUNCTIONS FOR COMMON USE CASES
// ============================================================================

/**
 * Show a loading toast that can be updated later
 */
export const showLoadingToast = (message: string = "Loading...") => {
  return toast.loading(message, {
    style: TOAST_STYLES.info,
    ...TOAST_CONFIG,
  });
};

/**
 * Update a loading toast to success
 */
export const updateLoadingToastToSuccess = (toastId: string, message: string) => {
  toast.success(message, {
    id: toastId,
    style: TOAST_STYLES.success,
    ...TOAST_CONFIG,
  });
};

/**
 * Update a loading toast to error
 */
export const updateLoadingToastToError = (toastId: string, message: string) => {
  toast.error(message, {
    id: toastId,
    style: TOAST_STYLES.error,
    ...TOAST_CONFIG,
  });
};

/**
 * Show a promise toast that automatically handles success/error states
 */
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: TOAST_STYLES.info,
      ...TOAST_CONFIG,
    }
  );
};
