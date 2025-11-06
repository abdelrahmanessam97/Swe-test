import ProductCard from "@/components/products/ProductCard";
import { useProductsStore } from "@/stores/productsStore";
import type { ProductDisplay } from "@/types/products";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductsFilterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchCategoryProducts } = useProductsStore();
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const categoryId = parseInt(id);
      if (!isNaN(categoryId)) {
        setIsLoading(true);
        setError(null);
        
        fetchCategoryProducts(categoryId)
          .then(() => {
            const currentProducts = useProductsStore.getState().products;
            setProducts([...currentProducts]);
          })
          .catch(() => {
            setError("Failed to load products");
            setProducts([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [id, fetchCategoryProducts]);



  if (error) {
    return (
      <section className="main-p  !pt-0">
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error loading products</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={() => id && fetchCategoryProducts(parseInt(id))}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-p  !pt-0">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-6 justify-items-center">
          {products.map((product, index) => (
            <ProductCard key={product.id || index} item={product} />
          ))}

          {products.length === 0 && (
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
    </section>
  );
};

export default ProductsFilterPage;
