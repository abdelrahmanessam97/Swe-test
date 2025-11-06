import EmptyState from "@/components/empty-state/EmptyState";
import Loading from "@/components/loading/Loading";
import ComparisonDisplay from "@/components/products/Comparison";
import { useProductsStore } from "@/stores/productsStore";
import type { ProductDetails } from "@/types/products";
import { useEffect, useState } from "react";

const CompareProductsPage = () => {
  const [comparisonDetails, setComparisonDetails] = useState<ProductDetails[]>([]);
  const { compareProducts, fetchCompareProducts, fetchProductDetails, isLoading } = useProductsStore();

  useEffect(() => {
    fetchCompareProducts();
  }, [fetchCompareProducts]);

  useEffect(() => {
    // When compare products are loaded, fetch full details for each product
    const loadProductDetails = async () => {
      if (compareProducts.length === 0) {
        setComparisonDetails([]);
        return;
      }

      try {
        const fetchedDetails: ProductDetails[] = [];

        // Fetch product details for each product in compare list sequentially
        for (const product of compareProducts) {
          await fetchProductDetails(product.id);
          const currentDetails = useProductsStore.getState().productDetails;
          if (currentDetails) {
            fetchedDetails.push(currentDetails);
          }
        }

        setComparisonDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    loadProductDetails();
  }, [compareProducts, fetchProductDetails]);

  if (isLoading && comparisonDetails.length === 0) {
    return <Loading />;
  }

  if (comparisonDetails.length === 0 && !isLoading) {
    return (
      <section className="main-p !pt-5 !pb-0">
        <EmptyState title="No Products to Compare" para="No products in your compare list. Add products to compare them." imgUrl="/compare-empty.png" activeLink={true} />
      </section>
    );
  }

  return (
    <section className="main-p !pt-5 !pb-0">
      <ComparisonDisplay comparisonDetails={comparisonDetails} />
    </section>
  );
};

export default CompareProductsPage;
