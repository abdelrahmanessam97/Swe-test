import type { ProductDetails } from "@/types/products";

interface ComparisonDisplayProps {
  comparisonDetails: ProductDetails[];
}

const ComparisonDisplay = ({ comparisonDetails }: ComparisonDisplayProps) => {
  // Get color attribute for a product
  const getColorAttribute = (productDetails: ProductDetails) => {
    return productDetails.productAttributes.find((attr) => attr.attributeControlType === "ImageSquares" || attr.attributeControlType === "ColorSquares");
  };

  // Get colors for a product
  const getColors = (productDetails: ProductDetails) => {
    const colorAttribute = getColorAttribute(productDetails);
    if (!colorAttribute) return [];

    return colorAttribute.values
      .filter((value) => (value.nameColor || value.colorSquaresRgb || value.imageSquaresPictureModel?.imageUrl) && value.name)
      .map((value) => ({
        name: value.name,
        nameColor: value.nameColor,
        bg: value.nameColor || value.colorSquaresRgb || "",
        rgb: value.nameColor || value.colorSquaresRgb || "",
        imageUrl: value.imageSquaresPictureModel?.imageUrl || null,
        thumbImageUrl: value.imageSquaresPictureModel?.thumbImageUrl || null,
        fullSizeImageUrl: value.imageSquaresPictureModel?.fullSizeImageUrl || null,
        isPreSelected: value.isPreSelected,
      }));
  };

  // Get selected color for a product
  const getSelectedColor = (productDetails: ProductDetails) => {
    const colorAttribute = getColorAttribute(productDetails);
    if (!colorAttribute) return null;
    const preSelected = colorAttribute.values.find((v) => v.isPreSelected);
    return preSelected?.name || colorAttribute.values[0]?.name || null;
  };

  return (
    <div className="max-w-[95vw] mx-auto flex flex-col p-0">
      <div className="text-left px-6 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compare Products</h1>
            <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet conse bolli tetur. Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {comparisonDetails.map((productDetails) => {
            const colors = getColors(productDetails);
            const selectedColor = getSelectedColor(productDetails);
            const specs = productDetails.specificationData?.specifications || [];

            return (
              <div key={productDetails.breadcrumb.productId} className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
                {/* Product Image */}
                <div className="w-full h-48 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={productDetails.defaultImage || productDetails.pictureImages[0] || "/placeholder.webp"}
                    alt={productDetails.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.webp";
                    }}
                  />
                </div>

                {/* Product Title & Price */}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{productDetails.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-3">{productDetails.price}</p>

                {/* Short Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{productDetails.shortDescription}</p>

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h3 className="font-medium text-[#7A7A7A]">Color: {selectedColor}</h3>
                    <div className="flex gap-1 flex-wrap">
                      {colors.map((color) => (
                        <button key={color.name} className="transition-all rounded-full p-1" title={color.nameColor || color.name}>
                          {color.nameColor ? (
                            <div
                              style={{ backgroundColor: color.nameColor }}
                              className={`w-6 h-6 rounded-full border-2 border-white transition-all ${
                                selectedColor === color.name ? "outline-1 outline-gray-600 scale-110" : "hover:border-gray-400"
                              }`}
                              title={color.nameColor}
                            />
                          ) : color.rgb ? (
                            <div
                              style={{ backgroundColor: color.rgb }}
                              className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                              title={color.name}
                            />
                          ) : color.imageUrl ? (
                            <img
                              src={color.thumbImageUrl || color.imageUrl}
                              alt={color.name}
                              className="w-5 h-5 object-cover rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            />
                          ) : (
                            <div
                              className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                              title="No color data"
                            >
                              ?
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Data Sheet */}
                <div className="mb-4">
                  <div className="flex items-center justify-between rounded-md gap-2 w-full bg-[#F0F0F0] text-[#505050] px-4 py-3">
                    <button className="flex items-center gap-2 cursor-pointer">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#569DD1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p className="text-[#505050] font-medium">Technical Data Sheet</p>
                    </button>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                </div>

                {/* Specifications */}
                {specs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-red-600 font-bold text-sm mb-2">Specifications</h4>
                    <ul className="space-y-2">
                      {specs.slice(0, 6).map((spec, idx) => (
                        <li key={idx} className="bg-[#F8F8F89E] px-3 py-2">
                          <span className="font-light">{spec.label}:</span>
                          <span className="text-[#7D7D7D] ms-2">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Long Description */}
                {productDetails.fullDescription && (
                  <div className="mt-auto mb-4">
                    <h4 className="text-red-600 font-bold text-sm mb-2">Description</h4>
                    <div
                      className="text-sm text-gray-600 leading-relaxed max-h-48 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: productDetails.fullDescription }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonDisplay;
