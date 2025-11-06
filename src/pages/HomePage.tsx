import AppDownload from "@/components/home/AppDownload";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import HomeSwiper from "@/components/home/HomeSwiper";
import Products from "@/components/home/Products";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useProductsStore } from "@/stores/productsStore";
import { useEffect } from "react";

const HomePage = () => {
  const { rootCategories, isLoading, error, fetchCategories, fetchRootCategories } = useCategoriesStore();
  const { productTags, tagProducts, fetchHomePageProducts, fetchProductTags, fetchTagProducts } = useProductsStore();

  useEffect(() => {
    fetchCategories();
    fetchHomePageProducts();
    fetchProductTags();
    fetchRootCategories(true);
  }, [fetchCategories, fetchHomePageProducts, fetchRootCategories, fetchProductTags]);

  useEffect(() => {
    productTags.forEach((tag) => {
      fetchTagProducts(tag.id);
    });
  }, [productTags, fetchTagProducts]);

  const handleRetry = () => {
    fetchCategories();
  };

  return (
    <section className="main-p !pt-0 !pb-0">
      <HomeSwiper />
      <div className="">
        <Categories categories={rootCategories} isLoading={isLoading} error={error} onRetry={handleRetry} loadImage={true} />
        {productTags[1] && (
          <Products
            title={productTags[1].name}
            desc="Discover everyday electrical essentials designed to keep your home safe, reliable, and connected. "
            link="/products"
            linkText="Find out more"
            products={tagProducts[productTags[1].id] || []}
            activeArrow
          />
        )}
        <Features />
        {productTags[0] && (
          <Products
            title={productTags[0].name}
            desc="Innovative EV chargers designed to keep you moving with speed, safety, and confidence. "
            link="/products"
            linkText="Find out more"
            products={tagProducts[productTags[0].id] || []}
            activeArrow
          />
        )}
        {productTags[2] && (
          <Products
            title={productTags[2].name}
            desc="Seamless connections for work, entertainment, and everything in between."
            link="/products"
            linkText="Find out more"
            products={tagProducts[productTags[2].id] || []}
            activeArrow
          />
        )}
        <AppDownload firstImage="/auth1.png" secondImage="/auth2.png" thirdImage="/auth3.png" />
      </div>
    </section>
  );
};

export default HomePage;
