import { useCartStore } from "@/stores/cartStore";
import type { ProductDetails } from "@/types/products";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Separator } from "../ui/separator";
import AddToCartSheet from "./AddToCartSheet";
import ShareProduct from "./ShareProduct";
import TechnicalDataSheet from "./TechnicalDataSheet";

interface ProductDetailsProps {
  productDetails: ProductDetails;
  onReadMore?: () => void;
}

const MainProductDetailsSec = ({ productDetails, onReadMore }: ProductDetailsProps) => {
  const [conductorType, setConductorType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  // const [bookmarked, setBookmarked] = useState(false);

  const { addToCart } = useCartStore();

  // Check if product has attributes
  const hasAttributes = Array.isArray(productDetails.productAttributes) && productDetails.productAttributes.length > 0;

  // Get conductor type attribute (RadioList)
  const conductorAttribute = hasAttributes ? productDetails.productAttributes.find((attr) => attr.attributeControlType === "RadioList") : undefined;

  const conductorOptions =
    conductorAttribute?.values
      .map((value) => ({
        value: value.name,
        label: value.name,
        price: value.priceAdjustmentValue,
        isDefault: value.isPreSelected,
      }))
      .filter((option) => option.value) || [];

  // Get colors/images from product attributes (ImageSquares or ColorSquares)
  const colorAttribute = hasAttributes
    ? productDetails.productAttributes.find((attr) => attr.attributeControlType === "ImageSquares" || attr.attributeControlType === "ColorSquares")
    : undefined;

  const colors =
    colorAttribute?.values
      .filter((value) => (value.nameColor || value.colorSquaresRgb || value.imageSquaresPictureModel?.imageUrl) && value.name) // Filter out null/invalid colors
      .map((value) => {
        return {
          name: value.name,
          nameColor: value.nameColor, // Use the extracted color from name
          bg: value.nameColor || value.colorSquaresRgb || "",
          rgb: value.nameColor || value.colorSquaresRgb || "",
          imageUrl: value.imageSquaresPictureModel?.imageUrl || null,
          thumbImageUrl: value.imageSquaresPictureModel?.thumbImageUrl || null,
          fullSizeImageUrl: value.imageSquaresPictureModel?.fullSizeImageUrl || null,
        };
      }) || [];

  // Set initial values when product details change
  useEffect(() => {
    // Set initial conductor type if not set and conductor options exist
    if (conductorType === "" && conductorOptions.length > 0) {
      const defaultOption = conductorOptions.find((opt) => opt.isDefault) || conductorOptions[0];
      setConductorType(defaultOption.value);
    }

    // Set initial color if not set and colors exist
    if (selectedColor === "" && colors.length > 0) {
      // Find preselected color from attribute values
      const preSelectedValue = colorAttribute?.values.find((v) => v.isPreSelected);
      const initialColor = preSelectedValue ? preSelectedValue.name : colors[0].name;
      setSelectedColor(initialColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails.breadcrumb.productId]);

  // Parse price string to numeric value
  const rawPrice = productDetails?.price_value || 0;

  // multiply by quantity
  const totalPrice = rawPrice * quantity;

  // show result in Arabic decimal format
  const displayPrice = `${totalPrice.toFixed(2).replace(".", "٫")} ${productDetails?.currency_code}`;

  // Get all images for the swiper - include color images first, then product picture images
  const getSwipeImages = () => {
    const colorImages = colors.map((c) => c.fullSizeImageUrl).filter(Boolean) as string[];
    // const productImages = [productDetails.defaultImage, ...productDetails.pictureImages].filter(Boolean) as string[];
    const productImages = [...productDetails.pictureImages].filter(Boolean) as string[];

    if (colorImages.length > 0) {
      // Keep color images first for correct color-to-slide mapping, then append unique product images
      const appendedUnique = productImages.filter((img) => !colorImages.includes(img));
      return [...colorImages, ...appendedUnique];
    }

    return productImages;
  };

  const allImages = getSwipeImages();

  // Function to build product attributes for API (handles multiple attributes)
  const buildProductAttributes = () => {
    const attributes: { attributeId: number; valueId: number }[] = [];

    productDetails.productAttributes.forEach((attr) => {
      let chosenValueId: number | undefined;

      // Use user-selected values for known attributes
      if (conductorAttribute && attr.id === conductorAttribute.id && conductorType) {
        chosenValueId = conductorAttribute.values.find((v) => v.name === conductorType)?.id;
      } else if (colorAttribute && attr.id === colorAttribute.id && selectedColor) {
        chosenValueId = colorAttribute.values.find((v) => v.name === selectedColor)?.id;
      } else {
        // Fallback to pre-selected value if any
        chosenValueId = attr.values.find((v) => v.isPreSelected)?.id;
      }

      if (attr.id !== undefined && chosenValueId !== undefined) {
        attributes.push({ attributeId: attr.id, valueId: chosenValueId });
      }
    });

    return attributes;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    const productAttributes = buildProductAttributes();
    await addToCart(productDetails.breadcrumb.productId, quantity, productAttributes);
  };

  // Handle add to wishlist
  // const handleAddToWishlist = async () => {
  //   const productAttributes = buildProductAttributes();
  //   await addToWishlist(productDetails.breadcrumb.productId, quantity, productAttributes);
  // };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full p-8 my-0 pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product images swiper */}
        <div className={`relative rounded-lg transform transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1}
            pagination={{
              el: ".custom-swiper-pagination",
              clickable: true,
            }}
            navigation={{
              nextEl: ".custom-swiper-next",
              prevEl: ".custom-swiper-prev",
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="w-[70%] h-[85%]"
          >
            {allImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img || ""} alt={`${productDetails.name} ${idx + 1}`} className="object-cover h-[90%] w-[90%] aspect-square" width={700} height={700} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom controls */}
          <div className="w-fit mx-auto z-10 flex items-center gap-4 mt-3">
            <button
              className="custom-swiper-prev bg-white/80 hover:bg-white rounded-full p-1 shadow transition border border-gray-600"
              type="button"
              aria-label="Previous image"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="custom-swiper-pagination" />
            <button
              className="custom-swiper-next bg-white/80 hover:bg-white rounded-full p-1 shadow transition border border-gray-600"
              type="button"
              aria-label="Next image"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`flex flex-col space-y-4 transform transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#535353] mb-1">{productDetails.name}</h3>
              <p className="text-xl font-extrabold text-[#535353]">{productDetails.price}</p>
            </div>

            <div className="flex gap-2">
              {/* Share Button */}
              <ShareProduct productId={productDetails.breadcrumb.productId.toString()} pageShareCode={productDetails.pageShareCode} />

              {/* Bookmark/Wishlist Button */}
              {/* <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setBookmarked(!bookmarked);
                  handleAddToWishlist();
                }}
                className={`rounded-full size-10 border border-[#F99E94] hover:bg-[#F99E94] hover:text-white  ${
                  bookmarked ? " bg-white text-[#F99E94]" : "text-[#F99E94]"
                }`}
                title="Add to Wishlist"
              >
                <Bookmark className={`size-6 ${bookmarked ? "fill-[#F99E94]" : "fill-none"}`} />
              </Button> */}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-[#7D7D7D] leading-relaxed">
            <p>{productDetails.shortDescription}</p>
            <button onClick={onReadMore} className="text-[#2388FFE3] text-sm mt-1 underline hover:text-[#1a6acc] transition-colors">
              Read More
            </button>
          </div>

          {/* Conductor Type - Only show if attribute exists */}
          {conductorAttribute && conductorOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#7A7A7A] text-md font-medium">
                {conductorAttribute.name} :
                {conductorOptions.map((option) => (
                  <div key={option.value} className={`flex justify-between items-center mt-0.5`}>
                    <span>{option.label}</span>
                    {option.price > 0 && <span className="text-[#B3B3B3]">+{option.price} </span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {conductorAttribute && conductorOptions.length > 0 && <Separator className="my-4" />}

          {/* Colors/Images - Only show if attribute exists */}
          {colorAttribute && colors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-[#7A7A7A]">
                {colorAttribute.name}: {selectedColor}
                {colorAttribute.isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <div className="flex gap-1 flex-wrap">
                {colors.map((color) => {
                  return (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        const selectedIndex = colors.findIndex((c) => c.name === color.name && c.fullSizeImageUrl);
                        if (selectedIndex !== -1 && swiperRef.current) {
                          swiperRef.current.slideTo(selectedIndex);
                        }
                      }}
                      className={`transition-all rounded-full p-1 `}
                      title={color.nameColor || color.name}
                    >
                      {color.nameColor ? (
                        // Display color circle using only nameColor
                        <div
                          style={{ backgroundColor: color.nameColor }}
                          className={`w-6 h-6 rounded-full border-2 border-white transition-all ${
                            selectedColor === color.name ? "outline-1 outline-gray-600 scale-110" : " hover:border-gray-400"
                          }`}
                          title={color.nameColor}
                        />
                      ) : color.rgb ? (
                        // Fallback to rgb if nameColor not available
                        <div
                          style={{ backgroundColor: color.rgb }}
                          className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          title={color.name}
                        />
                      ) : color.imageUrl ? (
                        // Display image only if no color is available
                        <img
                          src={color.thumbImageUrl || color.imageUrl}
                          alt={color.name}
                          className="w-5 h-5 object-cover rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        />
                      ) : (
                        // Debug: show a placeholder when no color is available
                        <div
                          className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                          title="No color data"
                        >
                          ?
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Separator className="mt-2" />
          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="flex items-center w-fit bg-[#F8F8F8] rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 transition-colors">
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= 10000) setQuantity(val);
                  }}
                  className="quantity-input w-16 text-center font-medium bg-transparent outline-none  py-2"
                />

                <button onClick={() => setQuantity(Math.min(10000, quantity + 1))} className="p-2 hover:bg-gray-100 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <AddToCartSheet productTotalPrice={displayPrice} onAddToCart={handleAddToCart} />
              </div>
            </div>

            {/* <div className="flex items-center text-sm text-[#C21D0BC2]">
              {productDetails.stockAvailability && (
                <>
                  <Info className="h-4 w-4 mr-1" />
                  <span>Minimum Quantity: 1 • Maximum Quantity: {productDetails.stockAvailability}</span>
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <TechnicalDataSheet productId={productDetails.breadcrumb.productId} />
      <hr className="my-6 w-full bg-[#0000001A]" />
    </div>
  );
};

export default MainProductDetailsSec;
