const productsPageEndpoints = {
  GetCategoriesRoot: "/api-frontend/Catalog/GetCatalogRoot",
  GetSingleCategory: "/api-frontend/Catalog/GetCategory/:categoryId",
  GetProductDetails: "/api-frontend/Product/GetProductDetails",
  GetRelatedProducts: "/api-frontend/Product/GetRelatedProducts",
  GetProductsReviews: "/api-frontend/Product/ProductReviews",
  GetDownloadSheet: "/api-frontend/Download/Sample",
  GetAllProductsTags: "/api-frontend/Catalog/ProductTagsAll",
  GetTagsProducts: "/api-frontend/Catalog/GetTagProducts/:productTagId",
  GetCompareProducts: "/api-frontend/Product/CompareProducts",
  AddProductToCompareList: "/api-frontend/Product/AddProductToCompareList",
  RemoveProductToCompareList: "/api-frontend/Product/RemoveProductFromCompareList",
};

export default productsPageEndpoints;
