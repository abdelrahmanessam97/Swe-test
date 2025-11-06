import type { CategoryRoot } from "@/types/categories";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FilterCategorySection from "./FilterCategorySection";

export type Category = {
  name: string;
  subCategories?: {
    name: string;
    count?: number;
    children?: {
      name: string;
      count?: number;
      children?: { name: string; count?: number; children?: { name: string; count?: number }[] }[];
    }[];
  }[];
};

interface FiltersSectionProps {
  categories: CategoryRoot[];
  isLoading: boolean;
}

// const colors = ["#D5776E", "#AEAAA8", "#2A745E", "#569DD1", "#FFE343", "#000000"];
// const styles = ["Contemporary", "Mediterranean", "Traditional"];
// const voltages = ["Low", "Medium", "High"];
// const sortedOptions = ["Lowest price", "Highest price"];

// Utility function to transform CategoryRoot to Category type
const transformCategories = (rootCategories: CategoryRoot[]): Category[] => {
  return rootCategories.map((cat) => ({
    name: cat.name,
    subCategories: cat.sub_categories?.map((sub: CategoryRoot) => ({
      name: sub.name,
      count: sub.number_of_products ?? undefined,
      children: sub.sub_categories?.map((child: CategoryRoot) => ({
        name: child.name,
        count: child.number_of_products ?? undefined,
        children: child.sub_categories?.map((grandChild: CategoryRoot) => ({
          name: grandChild.name,
          count: grandChild.number_of_products ?? undefined,
        })),
      })),
    })),
  }));
};

const FiltersSection = ({ categories: rootCategories, isLoading }: FiltersSectionProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<string | null>(null);
  const [selectedGrandChild, setSelectedGrandChild] = useState<string | null>(null);

  // const [selectedColor, setSelectedColor] = useState<string>("");
  // const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  // const [selectedVoltages, setSelectedVoltages] = useState<string[]>([]);
  // const [selectedSortedBy, setSelectedSortedBy] = useState<string | null>(null);

  // // Transform API categories to the format expected by the component
  const categories = useMemo(() => transformCategories(rootCategories), [rootCategories]);

  // Auto-select category based on URL parameter (only once when component mounts or URL changes)
  useEffect(() => {
    if (id && rootCategories.length > 0) {
      const categoryId = parseInt(id);
      if (!isNaN(categoryId)) {
        const matchingCategory = rootCategories.find((cat) => cat.id === categoryId);
        if (matchingCategory) {
          setSelectedCategory(matchingCategory.name);
          // Reset sub-categories when auto-selecting from URL
          setSelectedSubCategory(null);
          setSelectedChildCategory(null);
          setSelectedGrandChild(null);
        }
      }
    }
  }, [id, rootCategories]); // Removed selectedCategory from dependencies

  const toggleCategory = (name: string) => {
    const willSelect = selectedCategory !== name ? name : null;
    setSelectedCategory(willSelect);
    setSelectedSubCategory(null);
    setSelectedChildCategory(null);
    setSelectedGrandChild(null);

    // navigate to category page when selecting
    if (willSelect) {
      const match = rootCategories.find((cat) => cat.name === willSelect);
      if (match) {
        navigate(`/products/filter/${match.id}`);
      }
    }
  };

  const toggleSubCategory = (name: string) => {
    setSelectedSubCategory((prev) => (prev === name ? null : name));
    setSelectedChildCategory(null);
    setSelectedGrandChild(null);
  };

  const toggleChildCategory = (name: string) => {
    setSelectedChildCategory((prev) => (prev === name ? null : name));
    setSelectedGrandChild(null);
  };
  const toggleGrandChild = (name: string) => {
    setSelectedGrandChild((prev) => (prev === name ? null : name));
  };

  // const toggleStyle = (style: string) => {
  //   setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]));
  // };

  // const toggleVoltage = (voltage: string) => {
  //   setSelectedVoltages((prev) => (prev.includes(voltage) ? prev.filter((v) => v !== voltage) : [...prev, voltage]));
  // };

  // const STEP = 1;
  // const MIN = 0;
  // const MAX = 200;

  // const [values, setValues] = useState<number[]>([50, 150]);

  // const resetFilters = () => {
  //   setSelectedCategory(null);
  //   setSelectedSubCategory(null);
  //   setSelectedChildCategory(null);
  //   setValues([50, 150]);
  //   setSelectedColor("");
  //   setSelectedStyles([]);
  //   setSelectedVoltages([]);
  //   setSelectedSortedBy(null); // single value, not array
  // };

  // const applyFilters = () => {
  //   // TODO: Implement filter logic
  //   // Filter data: { category, subCategory, childCategory, price, color, styles, voltages, sortedBy }
  // };

  return (
    <aside className=" border-r border-[#E3E3E3] py-8 ps-4 md:px-4 lg:px-3 xl:px-10 space-y-6 text-sm text-[#9D9D9D] ">
      {/* Categories */}
      <FilterCategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        selectedChildCategory={selectedChildCategory}
        selectedGrandChild={selectedGrandChild}
        toggleCategory={toggleCategory}
        toggleSubCategory={toggleSubCategory}
        toggleChildCategory={toggleChildCategory}
        toggleGrandChild={toggleGrandChild}
        isLoading={isLoading}
      />

      {/* Price */}
      {/* <FilterPriceSection STEP={STEP} MIN={MIN} MAX={MAX} values={values} setValues={setValues} /> */}

      {/* Colors */}
      {/* <FilterColorSection colors={colors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} /> */}

      {/* Style */}
      {/* <FilterStyleSection styles={styles} selectedStyles={selectedStyles} toggleStyle={toggleStyle} /> */}

      {/* Voltage */}
      {/* <FilterVoltageSection voltages={voltages} selectedVoltages={selectedVoltages} toggleVoltage={toggleVoltage} /> */}

      {/* Sorted By */}
      {/* <FilterSortedBySection sortedBy={sortedOptions} selectedSortedBy={selectedSortedBy} onChange={setSelectedSortedBy} /> */}
      {/* Actions */}
      {/* <div className="space-y-4 mt-10">
        <button onClick={applyFilters} className="w-full bg-primary text-white py-2 rounded font-semibold">
          Apply Filter
        </button>
        <button onClick={resetFilters} className="w-full text-primary text-md font-semibold">
          Reset
        </button>
      </div> */}
    </aside>
  );
};

export default FiltersSection;
