import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { CategoryRoot } from "@/types/categories";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface BreadcrumbData {
  productId: number;
  productName: string;
}

interface BreadcCrumdProps {
  breadcrumb?: BreadcrumbData;
  categories?: CategoryRoot[];
  isLoading?: boolean;
}

const BreadcCrumd = ({ breadcrumb, categories = [], isLoading = false }: BreadcCrumdProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { id } = useParams<{ id: string }>();

  // Function to find category path by ID
  const findCategoryPath = (categoryId: number): CategoryRoot[] => {
    const path: CategoryRoot[] = [];

    const searchCategory = (cats: CategoryRoot[], targetId: number): boolean => {
      for (const cat of cats) {
        if (cat.id === targetId) {
          path.push(cat);
          return true;
        }

        if (cat.sub_categories && cat.sub_categories.length > 0) {
          path.push(cat);
          if (searchCategory(cat.sub_categories, targetId)) {
            return true;
          }
          path.pop(); // Remove if not found in this branch
        }
      }
      return false;
    };

    searchCategory(categories, categoryId);
    return path;
  };

  // Get current category path
  const categoryPath = id && !isNaN(parseInt(id)) ? findCategoryPath(parseInt(id)) : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={`hidden md:flex px-10 py-6 transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Show loading state */}
          {isLoading && id && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}

          {/* Show category path */}
          {!isLoading &&
            categoryPath.map((category, index) => (
              <div key={category.id} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === categoryPath.length - 1 ? (
                    // Last item - current category (not clickable)
                    <BreadcrumbPage>{category.name}</BreadcrumbPage>
                  ) : (
                    // Intermediate categories (clickable)
                    <BreadcrumbLink asChild>
                      <Link to={`/products/category/${category.id}`}>{category.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}

          {/* Show product breadcrumb if on product details page */}
          {breadcrumb && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumb.productName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  );
};

export default BreadcCrumd;
