import type {
  CompareProductsResponse,
  GetCategoryProductsRequest,
  Product,
  ProductAttribute,
  ProductAttributeValue,
  ProductDetails,
  ProductDisplay,
  ProductPictureModel,
  ProductReview,
  ProductReviewsResponse,
  ProductSpecificationData,
  ProductSpecificationModel,
  ProductsResponse,
  SpecificationItem,
} from "@/types/products";
import { getAuthToken } from "@/utils/auth/token";
import { baseUrl } from "@/utils/baseUrl";
import homePageEndpoints from "@/utils/home/endPoints";
import productsPageEndpoints from "@/utils/products/endPoints";
import { showToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface ProductTag {
  name: string;
  se_name: string;
  product_count: number;
  id: number;
}

interface ProductsState {
  products: ProductDisplay[];
  allProducts: Product[];
  homePageProducts: ProductDisplay[];
  relatedProducts: ProductDisplay[];
  productDetails: ProductDetails | null;
  productReviews: ProductReview[];
  productTags: ProductTag[];
  tagProducts: { [tagId: number]: ProductDisplay[] };
  compareProducts: Product[];
  compareProductsResponse: CompareProductsResponse | null;
  isLoading: boolean;
  error: string | null;
  currentCategoryId: number | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isDownloading: boolean;
  hasDownloadSheet: boolean;
}

interface ProductsActions {
  fetchCategoryProducts: (categoryId: number, requestBody?: GetCategoryProductsRequest) => Promise<void>;
  fetchHomePageProducts: () => Promise<void>;
  fetchProductDetails: (productId: number) => Promise<void>;
  fetchRelatedProducts: (productId: number) => Promise<void>;
  fetchProductReviews: (productId: number) => Promise<void>;
  fetchProductTags: () => Promise<void>;
  fetchTagProducts: (tagId: number, requestBody?: GetCategoryProductsRequest) => Promise<void>;
  fetchCompareProducts: () => Promise<void>;
  addProductToCompareList: (productId: number) => Promise<void>;
  removeProductFromCompareList: (productId: number) => Promise<void>;
  downloadTechnicalDataSheet: (productId: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearProducts: () => void;
}

// Default request body with static data
const defaultRequestBody: GetCategoryProductsRequest = {
  price: "string",
  specs: [0],
  ms: [0],
  order_by: 0,
  view_mode: "string",
  page_index: 1,
  page_number: 0,
  page_size: 100,
  total_items: 0,
  total_pages: 0,
  first_item: 0,
  last_item: 0,
  has_previous_page: true,
  has_next_page: true,
  custom_properties: {
    additionalProp1: "string",
    additionalProp2: "string",
    additionalProp3: "string",
  },
};

// Helper function to transform specification data
const transformSpecificationData = (specificationModel: ProductSpecificationModel, fullDescription: string | null): ProductSpecificationData => {
  const specifications: SpecificationItem[] = [];
  const features: string[] = [];

  specificationModel.groups.forEach((group) => {
    if (group.name === "Specifications") {
      group.attributes.forEach((attr) => {
        const value = attr.values[0]?.value_raw || "";
        if (value) {
          specifications.push({
            label: attr.name,
            value: value,
          });
        }
      });
    } else if (group.name === "Features") {
      group.attributes.forEach((attr) => {
        if (attr.name) {
          features.push(attr.name);
        }
      });
    }
  });

  return {
    specifications,
    features,
    description: fullDescription || "",
  };
};

export const useProductsStore = create<ProductsState & ProductsActions>((set, get) => ({
  products: [],
  allProducts: [],
  homePageProducts: [],
  relatedProducts: [],
  productDetails: null,
  productReviews: [],
  productTags: [],
  tagProducts: {},
  compareProducts: [],
  compareProductsResponse: null,
  isLoading: false,
  error: null,
  currentCategoryId: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 100,
  isDownloading: false,
  hasDownloadSheet: false,

  fetchCategoryProducts: async (categoryId: number, requestBody = defaultRequestBody) => {
    set({ isLoading: true, error: null, currentCategoryId: categoryId });

    try {
      const token = await getAuthToken();
      const { data } = await axios.post(`${baseUrl}${homePageEndpoints.GetCategoriesProducts}/${categoryId}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData: ProductsResponse = data;
      const catalogModel = responseData.catalog_products_model;

      // Transform the products data to match ProductCard expectations
      // Handle empty array case
      const transformedProducts: ProductDisplay[] = Array.isArray(catalogModel.products)
        ? catalogModel.products.map((product) => ({
            id: product.id,
            title: product.name,
            summary: product.short_description,
            price: product.product_price.price,
            image: product.picture_models[0]?.image_url || "/product1.jpg", // Fallback image
          }))
        : [];

      set({
        products: transformedProducts,
        allProducts: catalogModel.products,
        totalItems: catalogModel.total_items,
        totalPages: catalogModel.total_pages,
        currentPage: catalogModel.page_number,
        pageSize: catalogModel.page_size,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch products";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchHomePageProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${homePageEndpoints.GetProductHomePage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform the products data to match ProductDisplay expectations
      // Handle empty array case
      const transformedProducts: ProductDisplay[] = Array.isArray(data)
        ? data.map((product: Product) => ({
            id: product.id,
            title: product.name,
            summary: product.short_description,
            price: product.product_price.price,
            image: product.picture_models[0]?.image_url || "/product1.jpg", // Fallback image
          }))
        : [];

      set({
        homePageProducts: transformedProducts,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch home page products";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchProductDetails: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetProductDetails}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productDetailsModel = data.product_details_model;

      // Transform the product details data
      const transformedProductDetails: ProductDetails = {
        defaultImage: productDetailsModel.default_picture_model?.image_url || "",
        pictureImages: productDetailsModel.picture_models?.map((pic: ProductPictureModel) => pic.image_url) || [],
        name: productDetailsModel.name,
        shortDescription: productDetailsModel.short_description,
        fullDescription: productDetailsModel.full_description || "",
        price: productDetailsModel.product_price.price,
        currency_code: productDetailsModel.product_price.currency_code,
        price_value: productDetailsModel.product_price.price_value,
        stockAvailability: productDetailsModel.stock_availability || "",
        pageShareCode: productDetailsModel.page_share_code || "",
        breadcrumb: {
          productId: productDetailsModel.breadcrumb.product_id,
          productName: productDetailsModel.breadcrumb.product_name,
        },
        productAttributes:
          Array.isArray(productDetailsModel.product_attributes) && productDetailsModel.product_attributes.length > 0
            ? productDetailsModel.product_attributes.map((attr: ProductAttribute) => ({
                productId: attr.product_id,
                productAttributeId: attr.product_attribute_id,
                name: attr.name,
                attributeControlType: attr.attribute_control_type,
                isRequired: attr.is_required,
                id: attr.id, // This is the attribute ID used in request body (e.g., 3 for Conductor Type, 5 for Color)
                values: Array.isArray(attr.values)
                  ? attr.values.map((value: ProductAttributeValue) => {
                      // Split name on dash to extract color code
                      const nameParts = value.name.split("-");
                      const extractedName = nameParts[0] || value.name; // Get the part before the dash
                      const extractedColor = nameParts.length > 1 ? `${nameParts[1]}` : null; // Get the color code after the dash

                      return {
                        name: extractedName,
                        nameColor: extractedColor,
                        colorSquaresRgb: value.color_squares_rgb,
                        imageSquaresPictureModel: value.image_squares_picture_model
                          ? {
                              imageUrl: value.image_squares_picture_model.image_url,
                              fullSizeImageUrl: value.image_squares_picture_model.full_size_image_url,
                            }
                          : null,
                        priceAdjustmentValue: value.price_adjustment_value,
                        priceAdjustment: value.price_adjustment,
                        id: value.id, // This is the value ID used in request body (e.g., 6, 7 for Conductor; 10, 11 for Color)
                        isPreSelected: value.is_pre_selected,
                      };
                    })
                  : [],
              }))
            : [],
        specificationData: transformSpecificationData(productDetailsModel.product_specification_model, productDetailsModel.full_description),
      };

      set({
        productDetails: transformedProductDetails,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch product details";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchRelatedProducts: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetRelatedProducts}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform the products data to match ProductDisplay expectations
      // Handle empty array case
      const transformedProducts: ProductDisplay[] = Array.isArray(data)
        ? data.map((product: Product) => ({
            id: product.id,
            title: product.name,
            summary: product.short_description,
            price: product.product_price.price,
            image: product.picture_models[0]?.image_url || "/product1.jpg", // Fallback image
          }))
        : [];

      set({
        relatedProducts: transformedProducts,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch related products";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchProductReviews: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetProductsReviews}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reviewsResponse: ProductReviewsResponse = data;

      // Transform the reviews data
      const transformedReviews: ProductReview[] = reviewsResponse.items.map((item) => ({
        customerName: item.customer_name,
        reviewText: item.review_text,
        rating: item.rating,
        writtenOn: item.written_on_str,
      }));

      set({
        productReviews: transformedReviews,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch product reviews";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchProductTags: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetAllProductsTags}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        productTags: data.tags || [],
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch product tags";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchTagProducts: async (tagId: number, requestBody = defaultRequestBody) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.post(`${baseUrl}${productsPageEndpoints.GetTagsProducts.replace(":productTagId", String(tagId))}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const catalogModel = data.catalog_products_model;
      const transformedProducts: ProductDisplay[] = Array.isArray(catalogModel.products)
        ? catalogModel.products.map((product: Product) => ({
            id: product.id,
            title: product.name,
            summary: product.short_description,
            price: product.product_price.price,
            image: product.picture_models[0]?.image_url || "/product1.jpg",
          }))
        : [];

      set({
        tagProducts: { ...get().tagProducts, [tagId]: transformedProducts },
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch tag products";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  fetchCompareProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetCompareProducts}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const compareResponse: CompareProductsResponse = data;

      set({
        compareProducts: Array.isArray(compareResponse.products) ? compareResponse.products : [],
        compareProductsResponse: compareResponse,
        isLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to fetch compare products";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  addProductToCompareList: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      await axios.get(`${baseUrl}${productsPageEndpoints.AddProductToCompareList}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      set({
        isLoading: false,
      });
      showToast("Product added to compare list successfully", "success");

      // Optionally refresh the compare products list after adding
      // await get().fetchCompareProducts();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to add product to compare list";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  removeProductFromCompareList: async (productId: number) => {
    set({ isLoading: true, error: null });

    try {
      const token = await getAuthToken();
      await axios.get(`${baseUrl}${productsPageEndpoints.RemoveProductToCompareList}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        isLoading: false,
      });
      showToast("Product removed from compare list successfully", "success");

      // Optionally refresh the compare products list after removal
      await get().fetchCompareProducts();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to remove product from compare list";
      set({
        error: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, "error");
    }
  },

  downloadTechnicalDataSheet: async (productId: number) => {
    set({ isDownloading: true, error: null });

    try {
      const token = await getAuthToken();
      const { data } = await axios.get(`${baseUrl}${productsPageEndpoints.GetDownloadSheet}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle empty response
      if (!data.redirect_to_url && !data.download_binary) {
        set({ isDownloading: false, hasDownloadSheet: false });
        return;
      }

      // Mark as downloadable
      set({ hasDownloadSheet: true });

      if (data.redirect_to_url) {
        window.open(data.redirect_to_url, "_blank");
      } else if (data.download_binary) {
        const binaryString = atob(data.download_binary);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.file_name || "technical-data-sheet.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      set({ isDownloading: false });
      showToast("Technical data sheet downloaded successfully", "success");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || "Failed to download technical data sheet";

      set({
        error: errorMessage,
        isDownloading: false,
        hasDownloadSheet: false,
      });

      showToast(errorMessage, "error");
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  clearProducts: () =>
    set({
      products: [],
      allProducts: [],
      homePageProducts: [],
      relatedProducts: [],
      productDetails: null,
      productReviews: [],
      compareProducts: [],
      compareProductsResponse: null,
      currentCategoryId: null,
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
    }),
}));
