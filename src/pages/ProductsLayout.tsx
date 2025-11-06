import ValuesSections from "@/components/home/ValuesSections";
import Loading from "@/components/loading/Loading";
import BreadcCrumd from "@/components/products/BreadCrumd";
import FiltersSection from "@/components/products/FiltersSection";
import MainSection from "@/components/products/MainSection";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { FilterSheet } from "../components/products/FilterSheet";

const ProductsLayout = () => {
  const { rootCategories, isLoading, categoryDetails, fetchRootCategories, fetchSingleCategory } = useCategoriesStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchRootCategories(false); // false = don't load images for better performance
  }, [fetchRootCategories]);

  useEffect(() => {
    if (id) {
      const categoryId = parseInt(id);
      if (!isNaN(categoryId)) {
        fetchSingleCategory(categoryId);
      }
    }
  }, [id, fetchSingleCategory]);

  return (
    <main className="main-p  !pt-0">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <MainSection
            title={categoryDetails?.category_model_dto?.name || "All Products"}
            para={(
              categoryDetails?.category_model_dto?.description ||
              "Explore our full range of cables and electrical solutions. Find the right products for your needs—quality guaranteed, every time."
            ).replace(/<[^>]*>/g, "")}
            imgUrl={categoryDetails?.category_model_dto?.picture_model?.full_size_image_url || "/productMain-img.png"}
          />
          {/* Header with breadcrumb + filter sheet */}
          <div className="flex items-center justify-between w-full mb-6">
            <BreadcCrumd categories={rootCategories} />
            <div className=" block lg:hidden">
              <FilterSheet categories={rootCategories} isLoading={isLoading} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 px-8">
            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <FiltersSection categories={rootCategories} isLoading={isLoading} />
            </div>

            {/* Product grid */}
            <div className="col-span-12 lg:col-span-9">
              <Outlet />
            </div>
          </div>

          <div className="mb-20 mx-auto">
            <ValuesSections />
          </div>
        </>
      )}
    </main>
  );
};

export default ProductsLayout;
