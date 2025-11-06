import { useProductsStore } from "@/stores/productsStore";
import { BetweenVerticalStart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SpecificationSectionProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const SpecificationSection = ({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }: SpecificationSectionProps) => {
  const productDetails = useProductsStore((state) => state.productDetails);
  const addProductToCompareList = useProductsStore((state) => state.addProductToCompareList);
  const [internalActiveTab, setInternalActiveTab] = useState("Specifications");
  const [visible, setVisible] = useState(false);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const activeTab = externalActiveTab ?? internalActiveTab;
  const setActiveTab = externalSetActiveTab ?? setInternalActiveTab;

  const handleAddToCompare = async () => {
    if (!productDetails?.breadcrumb.productId || isAddingToCompare) return;

    setIsAddingToCompare(true);
    try {
      await addProductToCompareList(productDetails.breadcrumb.productId);
    } catch (error) {
      console.error("Error adding product to compare list:", error);
    } finally {
      setIsAddingToCompare(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const specs = productDetails?.specificationData.specifications || [];
  const features = productDetails?.specificationData.features || [];
  const description = productDetails?.specificationData.description || "";

  if (!specs.length && !features.length && !description) return null;

  return (
    <div
      ref={sectionRef}
      className={`border rounded-sm border-[#F0F0F0] transform transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-3 px-5">
          {specs.length > 0 && (
            <div className={`flex py-3 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                onClick={() => setActiveTab("Specifications")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "Specifications" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              >
                Specifications
              </button>
            </div>
          )}

          {features.length > 0 && (
            <div className={`flex py-3 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                onClick={() => setActiveTab("Features")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "Features" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              >
                Features
              </button>
            </div>
          )}

          {description && (
            <div className={`flex py-3 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                onClick={() => setActiveTab("Description")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "Description" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              >
                Description
              </button>
            </div>
          )}
        </div>

        {productDetails?.breadcrumb.productId && (
          <button
            onClick={handleAddToCompare}
            disabled={isAddingToCompare}
            className="px-5 py-1 me-5 text-primary font-medium cursor-pointer rounded-2xl border border-primary flex items-center gap-2 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BetweenVerticalStart className="size-5 text-primary" />
            {isAddingToCompare ? "Adding..." : "Compare Product"}
          </button>
        )}
      </div>

      <div className="p-4 text-sm">
        {activeTab === "Specifications" && specs.length > 0 && productDetails?.specificationData.specifications && (
          <ul className="space-y-2">
            {productDetails!.specificationData.specifications.map((item, i) => (
              <li
                key={i}
                className={`bg-[#F8F8F89E] px-3 py-2 transition-all duration-700 delay-${i * 100 + 200} ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="font-light">{item.label}:</span>
                <span className="text-[#7D7D7D] ms-2">{item.value}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Features" && features.length > 0 && productDetails?.specificationData.features && (
          <ul className="list-disc pl-5 space-y-1 text-[#7D7D7D] text-xs">
            {productDetails!.specificationData.features.map((feature, i) => (
              <li
                key={i}
                className={`text-sm marker:text-xs transition-all duration-700 delay-${i * 100 + 200} ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {feature}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "Description" && productDetails?.specificationData.description && (
          <div
            className={`text-[#7D7D7D] transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
};

export default SpecificationSection;
