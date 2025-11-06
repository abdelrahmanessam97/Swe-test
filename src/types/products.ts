/* eslint-disable @typescript-eslint/no-explicit-any */

// Product Types
export interface ProductPictureModel {
  image_url: string;
  thumb_image_url: string | null;
  full_size_image_url: string;
  title: string;
  alternate_text: string;
  custom_properties: Record<string, any>;
}

export interface ProductPrice {
  old_price: string | null;
  old_price_value: number | null;
  price: string;
  price_value: number;
  base_price_p_ang_v: string | null;
  base_price_p_ang_v_value: number;
  disable_buy_button: boolean;
  disable_wishlist_button: boolean;
  disable_add_to_compare_list_button: boolean;
  available_for_pre_order: boolean;
  pre_order_availability_start_date_time_utc: string | null;
  is_rental: boolean;
  force_redirection_after_adding_to_cart: boolean;
  display_tax_shipping_info: boolean;
  currency_code: string;
  price_with_discount: string | null;
  price_with_discount_value: number | null;
  customer_enters_price: boolean;
  call_for_price: boolean;
  product_id: number;
  hide_prices: boolean;
  rental_price: string | null;
  rental_price_value: number | null;
  custom_properties: Record<string, any>;
}

export interface ProductReviewOverview {
  product_id: number;
  rating_sum: number;
  total_reviews: number;
  allow_customer_reviews: boolean;
  can_add_new_review: boolean;
  custom_properties: Record<string, any>;
}

export interface Product {
  id: number;
  name: string;
  short_description: string;
  full_description: string | null;
  se_name: string;
  sku: string;
  product_type: string;
  mark_as_new: boolean;
  product_price: ProductPrice;
  picture_models: ProductPictureModel[];
  product_specification_model: any;
  review_overview_model: ProductReviewOverview;
  custom_properties: Record<string, any>;
}

export interface SortOption {
  disabled: boolean;
  group: string | null;
  selected: boolean;
  text: string;
  value: string;
}

export interface ViewMode {
  disabled: boolean;
  group: string | null;
  selected: boolean;
  text: string;
  value: string;
}

export interface PageSizeOption {
  disabled: boolean;
  group: string | null;
  selected: boolean;
  text: string;
  value: string;
}

export interface PriceRange {
  from: number;
  to: number;
  custom_properties: Record<string, any>;
}

export interface PriceRangeFilter {
  enabled: boolean;
  selected_price_range: PriceRange;
  available_price_range: PriceRange;
  custom_properties: Record<string, any>;
}

export interface CatalogProductsModel {
  use_ajax_loading: boolean;
  warning_message: string | null;
  no_result_message: string | null;
  price_range_filter: PriceRangeFilter;
  specification_filter: any;
  manufacturer_filter: any;
  allow_product_sorting: boolean;
  available_sort_options: SortOption[];
  allow_product_view_mode_changing: boolean;
  available_view_modes: ViewMode[];
  allow_customers_to_select_page_size: boolean;
  page_size_options: PageSizeOption[];
  order_by: number;
  view_mode: string;
  products: Product[];
  page_index: number;
  page_number: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  first_item: number;
  last_item: number;
  has_previous_page: boolean;
  has_next_page: boolean;
  custom_properties: Record<string, any>;
}

export interface ProductsResponse {
  template_view_path: string;
  catalog_products_model: CatalogProductsModel;
}

// Request body interface
export interface GetCategoryProductsRequest {
  price?: string;
  specs?: number[];
  ms?: number[];
  order_by?: number;
  view_mode?: string;
  page_index?: number;
  page_number?: number;
  page_size?: number;
  total_items?: number;
  total_pages?: number;
  first_item?: number;
  last_item?: number;
  has_previous_page?: boolean;
  has_next_page?: boolean;
  custom_properties?: Record<string, any>;
}

// Simplified product for UI display (compatible with existing ProductCard)
export interface ProductDisplay {
  id: number;
  title: string;
  summary: string;
  price: string;
  image: string;
}

// Product Attribute Types
export interface ProductAttributeValue {
  name: string;
  nameColor: string | null; // Extracted color code from name (e.g., "#000000" from "Black-#000000")
  color_squares_rgb: string | null;
  image_squares_picture_model: ProductPictureModel | null;
  price_adjustment: string | null;
  price_adjustment_use_percentage: boolean;
  price_adjustment_value: number;
  is_pre_selected: boolean;
  picture_id: number;
  customer_enters_qty: boolean;
  quantity: number;
  id: number;
  custom_properties: Record<string, any>;
}

export interface ProductAttribute {
  product_id: number;
  product_attribute_id: number;
  name: string;
  description: string | null;
  text_prompt: string;
  is_required: boolean;
  default_value: string | null;
  selected_day: number | null;
  selected_month: number | null;
  selected_year: number | null;
  has_condition: boolean;
  allowed_file_extensions: string[];
  attribute_control_type: string;
  values: ProductAttributeValue[];
  id: number;
  custom_properties: Record<string, any>;
}

// Breadcrumb Types
export interface CategoryBreadcrumb {
  name: string;
  se_name: string;
  number_of_products: number | null;
  include_in_top_menu: boolean;
  sub_categories: any[];
  have_sub_categories: boolean;
  route: string | null;
  picture_model: ProductPictureModel | null;
  id: number;
  custom_properties: Record<string, any>;
}

export interface ProductBreadcrumb {
  enabled: boolean;
  product_id: number;
  product_name: string;
  product_se_name: string;
  category_breadcrumb: CategoryBreadcrumb[];
  custom_properties: Record<string, any>;
}

// Add to Cart Types
export interface AddToCart {
  product_id: number;
  entered_quantity: number;
  minimum_quantity_notification: string | null;
  allowed_quantities: number[];
  customer_enters_price: boolean;
  customer_entered_price: number;
  customer_entered_price_range: string | null;
  disable_buy_button: boolean;
  disable_wishlist_button: boolean;
  is_rental: boolean;
  available_for_pre_order: boolean;
  pre_order_availability_start_date_time_utc: string | null;
  pre_order_availability_start_date_time_user_time: string | null;
  updated_shopping_cart_item_id: number;
  update_shopping_cart_item_type: string | null;
  custom_properties: Record<string, any>;
}

// Gift Card Types
export interface GiftCard {
  is_gift_card: boolean;
  recipient_name: string | null;
  recipient_email: string | null;
  sender_name: string | null;
  sender_email: string | null;
  message: string | null;
  gift_card_type: string;
  custom_properties: Record<string, any>;
}

// Vendor Types
export interface VendorModel {
  name: string | null;
  se_name: string | null;
  id: number;
  custom_properties: Record<string, any>;
}

// Product Specification Types
export interface ProductSpecificationAttributeValue {
  attribute_type_id: number;
  value_raw: string;
  color_squares_rgb: string | null;
  custom_properties: Record<string, any>;
}

export interface ProductSpecificationAttribute {
  name: string;
  values: ProductSpecificationAttributeValue[];
  id: number;
  custom_properties: Record<string, any>;
}

export interface ProductSpecificationGroup {
  name: string | null;
  attributes: ProductSpecificationAttribute[];
  id: number;
  custom_properties: Record<string, any>;
}

export interface ProductSpecificationModel {
  groups: ProductSpecificationGroup[];
  custom_properties: Record<string, any>;
}

// Transformed specification data for UI
export interface SpecificationItem {
  label: string;
  value: string;
}

export interface ProductSpecificationData {
  specifications: SpecificationItem[];
  features: string[];
  description: string;
}

// Product Details Model (from GetProductDetails API)
export interface ProductDetailsModel {
  default_picture_zoom_enabled: boolean;
  default_picture_model: ProductPictureModel | null;
  picture_models: ProductPictureModel[];
  video_models: any[];
  name: string;
  short_description: string;
  full_description: string | null;
  meta_keywords: string | null;
  meta_description: string;
  meta_title: string | null;
  se_name: string;
  visible_individually: boolean;
  product_type: string;
  show_sku: boolean;
  sku: string;
  show_manufacturer_part_number: boolean;
  manufacturer_part_number: string | null;
  show_gtin: boolean;
  gtin: string | null;
  show_vendor: boolean;
  vendor_model: VendorModel;
  has_sample_download: boolean;
  has_user_agreement: boolean;
  user_agreement_text: string | null;
  sample_download_id: number;
  gift_card: GiftCard;
  is_ship_enabled: boolean;
  is_free_shipping: boolean;
  free_shipping_notification_enabled: boolean;
  delivery_date: string | null;
  is_rental: boolean;
  rental_start_date: string | null;
  rental_end_date: string | null;
  available_end_date: string | null;
  manage_inventory_method: string;
  stock_availability: string;
  display_back_in_stock_subscription: boolean;
  email_a_friend_enabled: boolean;
  compare_products_enabled: boolean;
  page_share_code: string;
  product_price: ProductPrice;
  add_to_cart: AddToCart;
  breadcrumb: ProductBreadcrumb;
  product_tags: any[];
  product_attributes: ProductAttribute[];
  product_specification_model: ProductSpecificationModel;
  product_manufacturers: any[];
  product_review_overview: ProductReviewOverview;
  product_estimate_shipping: any;
  tier_prices: any[];
  associated_products: any[];
  display_discontinued_message: boolean;
  current_store_name: string;
  in_stock: boolean;
  allow_adding_only_existing_attribute_combinations: boolean;
  id: number;
  custom_properties: Record<string, any>;
}

// Product Details Response (from GetProductDetails API)
export interface ProductDetailsResponse {
  product_template_view_path: string;
  product_details_model: ProductDetailsModel;
}

// Transformed Product Details (for store state)
export interface ProductDetails {
  defaultImage: string;
  pictureImages: string[];
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  price_value: number;
  stockAvailability: string;
  pageShareCode: string;
  currency_code: string;
  breadcrumb: {
    productId: number;
    productName: string;
  };
  productAttributes: Array<{
    productId: number;
    productAttributeId: number; // Maps to API's "product_attribute_id"
    name: string;
    attributeControlType: string;
    isRequired: boolean; // Maps to API's "is_required"
    id: number; // Maps to API's "id" field (the attribute ID used in request body)
    values: Array<{
      name: string;
      nameColor: string | null; // Extracted color code from name (e.g., "#000000" from "Black-#000000")
      colorSquaresRgb: string | null;
      imageSquaresPictureModel: {
        imageUrl: string | null;
        thumbImageUrl: string | null;
        fullSizeImageUrl: string | null;
      } | null;
      priceAdjustmentValue: number;
      priceAdjustment: string | null;
      id: number; // Maps to API's "id" field (the value ID used in request body)
      isPreSelected: boolean; // Maps to API's "is_pre_selected"
    }>;
  }>;
  specificationData: ProductSpecificationData;
}

// Product Reviews Types
export interface ProductReviewHelpfulness {
  product_review_id: number;
  helpful_yes_total: number;
  helpful_no_total: number;
  custom_properties: Record<string, any>;
}

export interface ProductReviewItem {
  customer_id: number;
  customer_avatar_url: string | null;
  customer_name: string;
  allow_viewing_profiles: boolean;
  title: string;
  review_text: string;
  reply_text: string | null;
  rating: number;
  written_on_str: string;
  helpfulness: ProductReviewHelpfulness;
  additional_product_review_list: any[];
  id: number;
  custom_properties: Record<string, any>;
}

export interface ProductReviewsResponse {
  product_id: number;
  product_name: string | null;
  product_se_name: string | null;
  items: ProductReviewItem[];
  add_product_review: any;
  review_type_list: any[];
  add_additional_product_review_list: any[];
  custom_properties: Record<string, any>;
}

// Simplified Review for component props
export interface ProductReview {
  customerName: string;
  reviewText: string;
  rating: number;
  writtenOn: string;
}

// Compare Products Response
export interface CompareProductsResponse {
  products: Product[];
  include_short_description_in_compare_products: boolean;
  include_full_description_in_compare_products: boolean;
  id: number;
  custom_properties: Record<string, any>;
}
