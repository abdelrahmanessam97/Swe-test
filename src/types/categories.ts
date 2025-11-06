/* eslint-disable @typescript-eslint/no-explicit-any */

// Category Types
export interface CategoryPictureModel {
  image_url: string;
  thumb_image_url: string | null;
  full_size_image_url: string;
  title: string;
  alternate_text: string;
  custom_properties: Record<string, any>;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  meta_title: string | null;
  se_name: string;
  picture_model: CategoryPictureModel | null;
  display_category_breadcrumb: boolean;
  category_breadcrumb: any[];
  sub_categories: any[];
  featured_products: any[];
  catalog_products_model: any;
  custom_properties: Record<string, any>;
}

// New interface for GetCategoriesRoot response
export interface CategoryRoot {
  id: number;
  name: string;
  se_name: string;
  number_of_products: number | null;
  include_in_top_menu: boolean;
  sub_categories: any[];
  have_sub_categories: boolean;
  route: string;
  picture_model: CategoryPictureModel | null;
  custom_properties: Record<string, any>;
}

// Simplified category for UI display
export interface CategoryDisplay {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
}

// Single Category details (GetSingleCategory)
export interface CategoryDetailsPictureModel {
  image_url: string | null;
  thumb_image_url: string | null;
  full_size_image_url: string | null;
  title: string | null;
  alternate_text: string | null;
  custom_properties: Record<string, any>;
}

export interface CategoryDetailsModelDto {
  name: string;
  description: string | null;
  se_name: string;
  picture_model: CategoryDetailsPictureModel | null;
  id: number;
}

export interface CategoryDetailsResponse {
  template_view_path: string;
  category_model_dto: CategoryDetailsModelDto;
}
