import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Navigate, RouterProvider, useLocation, useParams } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Loading from "./components/loading/Loading";
import AuthenticationPage from "./pages/AuthenticationPage";
import AuthLayout from "./pages/AuthLayout";
import CartPage from "./pages/CartPage";
import CompareProductsPage from "./pages/CompareProductsPage";
import CompleteProfile from "./pages/CompleteProfilePage";
import Layouts from "./pages/Layouts";
import LoginPage from "./pages/LoginPage";
import OtpVerification from "./pages/OtpVerificationPage";
import PrivacyAndPolicy from "./pages/PrivacyAndPolicy";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsFilterPage from "./pages/ProductsFilterPage";
import ProductsLayout from "./pages/ProductsLayout";
import ProductsPage from "./pages/ProductsPage";
import ProfileInfoPage from "./pages/ProfileInfoPage";
import ProfileLayout from "./pages/ProfileLayout";
import ProfileMyAddressPage from "./pages/ProfileMyAddressPage";
import ProfileOrderDetailsPage from "./pages/ProfileOrderDetailsPage";
import ProfileOrderHistoryPage from "./pages/ProfileOrderHistoryPage";
import RegisterPage from "./pages/RegisterPage";
import SavedProductsPage from "./pages/SavedProductsPage";
import SupportPage from "./pages/SupportPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import { fetchGuestToken } from "./utils/auth/token";
import type { SupportedLanguage } from "./utils/pathLanguage";
import { getCookie, SUPPORTED_LANGUAGES } from "./utils/pathLanguage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500 && ![408, 429].includes(error?.response?.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Language validation wrapper
function WithLanguageValidation({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  // If invalid language, redirect to English
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return <Navigate to={`/en${location.pathname.replace(`/${lang}`, "")}${location.search}${location.hash}`} replace />;
  }

  return <>{children}</>;
}

// Redirect component for routes without language prefix
function RedirectToLanguage() {
  const location = useLocation();
  const savedLanguage = getCookie("i18nextLng") || "en";
  return <Navigate to={`/${savedLanguage}${location.pathname}${location.search}${location.hash}`} replace />;
}

const router = createBrowserRouter([
  {
    path: "/:lang",
    element: (
      <WithLanguageValidation>
        <Layouts />
      </WithLanguageValidation>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // products routes
      {
        path: "products",
        element: <ProductsPage />,
      },
      // products filter layout routes
      {
        path: "products/filter",
        element: <ProductsLayout />,
        children: [
          {
            index: true,
            element: <ProductsFilterPage />,
          },
          {
            path: ":id",
            element: <ProductsFilterPage />,
          },
        ],
      },
      {
        path: "products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "products/compare",
        element: <CompareProductsPage />,
      },
      // profile routes (protected)
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "personal-info",
            element: (
              <ProtectedRoute>
                <ProfileInfoPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "order-history",
            element: (
              <ProtectedRoute>
                <ProfileOrderHistoryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "order-history/:id",
            element: (
              <ProtectedRoute>
                <ProfileOrderDetailsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "my-address",
            element: (
              <ProtectedRoute>
                <ProfileMyAddressPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // support routes
      {
        path: "support",
        element: <SupportPage />,
      },
      // about_hub routes
      {
        path: "about_hub",
        element: <AuthenticationPage />,
      },
      // terms and conditions
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
      // privacy and policy
      {
        path: "privacy-policy",
        element: <PrivacyAndPolicy />,
      },
      // cart routes
      {
        path: "cart",
        element: <CartPage />,
      },
      // saved products routes
      {
        path: "saved-products",
        element: <SavedProductsPage />,
      },
      {
        path: "loading",
        element: <Loading />,
      },
    ],
  },
  // auth routes
  {
    path: "/:lang/auth",
    element: (
      <WithLanguageValidation>
        <AuthLayout />
      </WithLanguageValidation>
    ),
    children: [
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "verify",
        element: <OtpVerification />,
      },
      {
        path: "complete-profile",
        element: <CompleteProfile />,
      },
    ],
  },
  // Redirect routes without language prefix
  {
    path: "/",
    element: <RedirectToLanguage />,
  },
  {
    path: "/products",
    element: <RedirectToLanguage />,
  },
  {
    path: "/products/*",
    element: <RedirectToLanguage />,
  },
  {
    path: "/profile",
    element: <RedirectToLanguage />,
  },
  {
    path: "/profile/*",
    element: <RedirectToLanguage />,
  },
  // {
  //   path: "/deals",
  //   element: <RedirectToLanguage />,
  // },
  {
    path: "/support",
    element: <RedirectToLanguage />,
  },
  {
    path: "/about_hub",
    element: <RedirectToLanguage />,
  },
  {
    path: "/terms-and-conditions",
    element: <RedirectToLanguage />,
  },
  {
    path: "/privacy-policy",
    element: <RedirectToLanguage />,
  },
  {
    path: "/cart",
    element: <RedirectToLanguage />,
  },
  {
    path: "/saved-products",
    element: <RedirectToLanguage />,
  },
  {
    path: "/loading",
    element: <RedirectToLanguage />,
  },
  {
    path: "/auth",
    element: <RedirectToLanguage />,
  },
  {
    path: "/auth/*",
    element: <RedirectToLanguage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  useEffect(() => {
    const guestToken = Cookies.get("guest_token");
    const userToken = Cookies.get("auth_token");
    if (!guestToken) fetchGuestToken();
    if (!userToken) fetchGuestToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            zIndex: 9999,
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
