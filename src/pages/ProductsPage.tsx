import Categories from "@/components/home/Categories";
import ValuesSections from "@/components/home/ValuesSections";
import MainSection from "@/components/products/MainSection";
import ProductCard from "@/components/products/ProductCard";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useProductsStore } from "@/stores/productsStore";
import type { ProductDisplay } from "@/types/products";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  const { rootCategories, isLoading, error, fetchRootCategories } = useCategoriesStore();
  const { fetchCategoryProducts } = useProductsStore();
  const [categoryProducts, setCategoryProducts] = useState<Record<number, ProductDisplay[]>>({});
  const [loadingCategories, setLoadingCategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchRootCategories(true);
  }, [fetchRootCategories]);

  // Fetch products for each category individually
  const fetchProductsForCategory = useCallback(
    async (categoryId: number) => {
      setLoadingCategories((prev) => ({ ...prev, [categoryId]: true }));

      try {
        await fetchCategoryProducts(categoryId);
        // Get the current products from the store after fetching
        const currentProducts = useProductsStore.getState().products;
        setCategoryProducts((prev) => ({
          ...prev,
          [categoryId]: [...currentProducts], // Make a copy to avoid reference issues
        }));
      } catch {
        setCategoryProducts((prev) => ({
          ...prev,
          [categoryId]: [], // Set empty array on error
        }));
      } finally {
        setLoadingCategories((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [fetchCategoryProducts]
  );

  // Fetch products for all categories when categories are loaded
  useEffect(() => {
    if (rootCategories.length > 0) {
      rootCategories.forEach((category) => {
        fetchProductsForCategory(category.id);
      });
    }
  }, [rootCategories, fetchProductsForCategory]);

  const handleRetry = () => {
    fetchRootCategories(true);
  };

  return (
    <div className="main-p  !pt-0">
      <MainSection
        title="All Products"
        para="Explore our full range of cables and electrical solutions. Find the right products for your needs—quality guaranteed, every time."
        imgUrl="/productMain-img.png"
      />

      <Categories categories={rootCategories} isLoading={isLoading} error={error} onRetry={handleRetry} loadImage={true} />

      {rootCategories.map((item) => (
        <div className="p-12" key={item.id}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-xl ms-5 text-[#505050]"> {item.name}</h3>
            <Link
              to={`/products/filter/${item.id}`}
              onClick={() => window.scrollTo(0, 0)}
              className="hidden lg:flex items-center text-[#7D7D7D] hover:!text-primary group transition-all duration-300 text-lg"
            >
              Find out more
              <ArrowRight className="size-5 ms-2 group-hover:ms-4 transition-all duration-300" />
            </Link>
          </div>

          {/* Show loading state for each category's products */}
          {loadingCategories[item.id] ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 justify-items-center">
              {(categoryProducts[item.id] || []).map((product, index) => (
                <ProductCard key={product.id || index} item={product} />
              ))}

              {/* Show message if no products */}
              {categoryProducts[item.id] && categoryProducts[item.id].length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Products Available</h4>
                  <p className="text-gray-500 text-sm max-w-sm">We couldn't find any products in this category. Please check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="mx-auto">
        <ValuesSections />
      </div>
    </div>
  );
};

export default ProductsPage;
