import { useProductsStore } from "@/stores/productsStore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AppDownload from "../components/home/AppDownload";
import Products from "../components/home/Products";
import ValuesSections from "../components/home/ValuesSections";
import Loading from "../components/loading/Loading";
import BreadcCrumd from "../components/products/BreadCrumd";
import MainProductDetailsSec from "../components/products/MainProductDetailsSec";
import SpecificationSection from "../components/products/SpecificationSection";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Description");
  const specificationSectionRef = useRef<HTMLDivElement>(null);

  const { productDetails, homePageProducts, relatedProducts, fetchProductDetails, fetchHomePageProducts, fetchRelatedProducts, fetchProductReviews, isLoading, error } =
    useProductsStore();

  const handleReadMore = () => {
    setActiveTab("Description");
    // Small delay to ensure tab state is updated before scrolling
    setTimeout(() => {
      if (specificationSectionRef.current) {
        // Get the element's position relative to the viewport
        const elementTop = specificationSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementTop + window.pageYOffset - 400; // 100px offset from top

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (id) {
      const productId = parseInt(id);
      fetchProductDetails(productId);
      fetchRelatedProducts(productId);
      fetchProductReviews(productId);
    }
    // Fetch home page products as fallback if needed
    if (homePageProducts.length === 0) {
      fetchHomePageProducts();
    }
  }, [id, fetchProductDetails, fetchRelatedProducts, fetchProductReviews, fetchHomePageProducts, homePageProducts.length]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="main-p  !pt-5 !pb-0">
      <BreadcCrumd breadcrumb={productDetails?.breadcrumb} />
      {productDetails && <MainProductDetailsSec productDetails={productDetails} onReadMore={handleReadMore} />}
      <div className="p-6 space-y-8">
        {/* Specifications + Highlights */}
        <div className="col-span-2" ref={specificationSectionRef}>
          <SpecificationSection activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      {relatedProducts.length > 0 ? (
        <Products title="Related Products" link="/products" linkText="Find out more" products={relatedProducts} activeArrow />
      ) : (
        ""
        // <section className="py-12">
        //   <div className="container">
        //     <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-8">Related Products</h2>
        //     <div className="flex flex-col items-center justify-center py-16 text-center">
        //       <div className="text-gray-400 mb-4">
        //         <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        //         </svg>
        //       </div>
        //       <h3 className="text-xl font-semibold text-gray-600 mb-2">No Related Products</h3>
        //       <p className="text-gray-500 max-w-md">We couldn't find any related products for this item. Check out our other products instead.</p>
        //     </div>
        //   </div>
        // </section>
      )}
      <div className="mx-auto">
        <ValuesSections />
      </div>
      <AppDownload firstImage="/auth1.png" secondImage="/auth2.png" thirdImage="/auth3.png" />
    </section>
  );
};

export default ProductDetailsPage;
