export interface CartItemPicture {
  image_url: string;
  thumb_image_url: string | null;
  full_size_image_url: string;
  title: string;
  alternate_text: string;
  custom_properties: Record<string, unknown>;
}

export interface CartItemRaw {
  sku: string;
  vendor_name: string;
  picture: CartItemPicture;
  product_id: number;
  product_name: string;
  product_se_name: string;
  unit_price: string;
  unit_price_value: number;
  sub_total: string;
  sub_total_value: number;
  discount: string | null;
  discount_value: number;
  maximum_discounted_qty: number | null;
  quantity: number;
  allowed_quantities: number[];
  attribute_info: string;
  recurring_info: unknown;
  rental_info: unknown;
  allow_item_editing: boolean;
  disable_removal: boolean;
  warnings: string[];
  id: number;
  custom_properties: Record<string, unknown>;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  image_url: string;
  unit_price: string;
  sub_total: string;
  discount: string;
  quantity: number;
  _unit_price_value: number;
  _sub_total_value: number;
  _discount_value: number;
}
export interface DiscountBox {
  applied_discounts_with_codes: unknown[];
  display: boolean;
  messages: string[];
  is_applied: boolean;
  custom_properties: Record<string, unknown>;
}

export interface GiftCardBox {
  display: boolean;
  message: string | null;
  is_applied: boolean;
  custom_properties: Record<string, unknown>;
}

export interface CartResponse {
  one_page_checkout_enabled: boolean;
  show_sku: boolean;
  show_product_images: boolean;
  is_editable: boolean;
  items: CartItemRaw[];
  checkout_attributes: unknown[];
  warnings: string[];
  min_order_subtotal_warning: string | null;
  display_tax_shipping_info: boolean;
  terms_of_service_on_shopping_cart_page: boolean;
  terms_of_service_on_order_confirm_page: boolean;
  terms_of_service_popup: boolean;
  discount_box: DiscountBox;
  gift_card_box: GiftCardBox;
  order_review_data: unknown;
  hide_checkout_button: boolean;
  show_vendor_name: boolean;
  custom_properties: Record<string, unknown>;
}
