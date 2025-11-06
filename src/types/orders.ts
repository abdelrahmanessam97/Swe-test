export interface OrderSummary {
  custom_order_number: string;
  order_total: string;
  is_return_request_allowed: boolean;
  order_status_enum: number;
  order_status: string;
  payment_status: string;
  shipping_status: string;
  created_on: string; // ISO datetime string
  id: number;
  custom_properties: Record<string, unknown>;
}

export interface OrdersResponse {
  orders: OrderSummary[];
  recurring_orders: unknown[];
  recurring_payment_errors: unknown[];
  custom_properties: Record<string, unknown>;
}

// Narrowed Order Details interface based on backend response used by UI
export interface OrderDetailsAddress {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip_postal_code: string | null;
  id: number;
  custom_properties: Record<string, unknown>;
}

export interface OrderDetailsItemPicture {
  image_url: string | null;
  thumb_image_url: string | null;
  full_size_image_url: string | null;
  title: string | null;
  alternate_text: string | null;
  custom_properties: Record<string, unknown>;
}

export interface OrderDetailsItem {
  order_item_guid: string;
  sku: string;
  product_id: number;
  product_name: string;
  product_se_name: string;
  unit_price: string; // e.g. "50.000 (EGP)"
  unit_price_value: number; // 50
  sub_total: string;
  sub_total_value: number;
  quantity: number;
  picture: OrderDetailsItemPicture;
  attribute_info: string | null;
  id: number;
  custom_properties: Record<string, unknown>;
}

export interface OrderDetails {
  print_mode: boolean;
  pdf_invoice_disabled: boolean;
  custom_order_number: string; // e.g. "2002"
  created_on: string; // ISO datetime
  order_status: string; // e.g. "Pending"
  is_re_order_allowed: boolean;
  is_return_request_allowed: boolean;
  is_shippable: boolean;
  shipping_status: string; // e.g. "Not yet shipped"
  shipping_address: OrderDetailsAddress;
  billing_address: OrderDetailsAddress;
  shipping_method: string | null;
  payment_method: string | null; // e.g. "Payments.CashOnDelivery"
  payment_method_status: string | null; // e.g. "Pending"
  order_subtotal: string; // "50.000 (EGP)"
  order_subtotal_value: number;
  order_shipping: string; // "10.000 (EGP)"
  order_shipping_value: number;
  tax: string;
  order_total: string; // "60.000 (EGP)"
  order_total_value: number;
  items: OrderDetailsItem[];
  show_product_thumbnail?: boolean;
  id: number; // e.g. 2002
  custom_properties: Record<string, unknown>;
}
