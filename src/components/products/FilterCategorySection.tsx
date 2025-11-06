import { useCategoriesStore } from "@/stores/categoriesStore";
import { useLocation, useParams } from "react-router-dom";
import type { Category } from "./FiltersSection";

type Props = {
  categories: Category[];
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  selectedChildCategory: string | null;
  selectedGrandChild: string | null;
  toggleCategory: (name: string) => void;
  toggleSubCategory: (name: string) => void;
  toggleChildCategory: (name: string) => void;
  toggleGrandChild: (name: string) => void;
  isLoading?: boolean;
};

const FilterCategorySection = ({
  categories,
  selectedCategory,
  selectedSubCategory,
  selectedChildCategory,
  selectedGrandChild,
  toggleCategory,
  toggleSubCategory,
  toggleChildCategory,
  toggleGrandChild,
  isLoading = false,
}: Props) => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { rootCategories } = useCategoriesStore();

  // helper function to check if category is active based on URL ID or selected state
  const isActiveCategory = (name: string) => {
    // If any category is manually selected, only that one should be active
    if (selectedCategory !== null) {
      return selectedCategory === name;
    }

    // If no manual selection, check if the current URL matches this category by ID
    if (id && location.pathname.includes("/products/filter/")) {
      const categoryId = parseInt(id);
      if (!isNaN(categoryId)) {
        // Find the category by ID from rootCategories and check if names match
        const matchingCategory = rootCategories.find((cat) => cat.id === categoryId);
        if (matchingCategory && matchingCategory.name === name) {
          return true;
        }
      }
    }

    // Fallback to pathname check for other cases
    return location.pathname.toLowerCase().includes(name.toLowerCase());
  };

  // Uncomment if you want an "All" button
  // <button
  //   onClick={() => toggleCategory("")} // use empty string to mean "All"
  //   className={`block mb-2 ${selectedCategory === null ? "text-[#C21D0B] font-semibold" : "text-[#9D9D9D]"}`}
  // >
  //   All
  // </button>

  return (
    <div>
      <h3 className="font-medium mb-3 text-[#505050] flex items-center">
        Categories
        {isLoading && categories.length === 0 && (
          <div className="ml-2 flex items-center">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </h3>

      {categories.length === 0 && isLoading ? (
        <div className="space-y-2">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/5"></div>
          </div>
        </div>
      ) : (
        categories.map((cat) => {
          const active = isActiveCategory(cat.name);

          return (
            <div key={cat.name}>
              <button onClick={() => toggleCategory(cat.name)} className={`flex items-center mb-3 md:mb-2 ${active ? "text-[#C21D0B] font-semibold" : "text-[#9D9D9D]"}`}>
                {cat.subCategories && (
                  <span className="mr-2 text-xs">
                    {active ? <img src="/arrow-down.png" className="max-w-1.5" alt="" /> : <img src="/arrow-right.png" className="max-w-1.5" alt="" />}
                  </span>
                )}
                {cat.name}
              </button>

              {active &&
                cat.subCategories?.map((sub) => (
                  <div key={sub.name}>
                    <button
                      onClick={() => toggleSubCategory(sub.name)}
                      className={`ml-6 flex items-center mb-1 ${selectedSubCategory === sub.name ? "text-[#000000] font-semibold" : "text-[#9D9D9D]"}`}
                    >
                      {sub.children && (
                        <span className="mr-2 text-xs">
                          {selectedSubCategory === sub.name ? (
                            <img src="/arrow-down.png" className="max-w-1.5" alt="" />
                          ) : (
                            <img src="/arrow-right.png" className="max-w-1.5" alt="" />
                          )}
                        </span>
                      )}
                      {sub.name} {sub.count && <span className="text-gray-500 !text-xs">({sub.count} Product)</span>}
                    </button>

                    {selectedSubCategory === sub.name &&
                      sub.children?.map((child) => (
                        <div key={child.name}>
                          <button
                            onClick={() => toggleChildCategory(child.name)}
                            className={`ml-12 flex items-center mb-1 ${selectedChildCategory === child.name ? "text-[#000000] font-semibold" : "text-gray-500"}`}
                          >
                            {child.children && (
                              <span className="mr-2 text-xs">
                                {selectedChildCategory === child.name ? (
                                  <img src="/arrow-down.png" className="max-w-1.5" alt="" />
                                ) : (
                                  <img src="/arrow-right.png" className="max-w-1.5" alt="" />
                                )}
                              </span>
                            )}
                            {child.name} {child.count && <span className="text-gray-500 ms-1 !text-xs">({child.count} Product)</span>}
                          </button>

                          {selectedChildCategory === child.name &&
                            child.children?.map((grand) => (
                              <div
                                key={grand.name}
                                onClick={() => toggleGrandChild(grand.name)}
                                className={`ml-16 cursor-pointer mb-1 ${selectedGrandChild === grand.name ? "text-[#000000] font-semibold text-xs" : "text-gray-500"}`}
                              >
                                {grand.name} {grand.count && <span className="text-gray-500 !text-xs">({grand.count} Product)</span>}
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default FilterCategorySection;
