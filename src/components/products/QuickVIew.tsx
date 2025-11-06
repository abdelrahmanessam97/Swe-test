import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";
import type { ProductDetails } from "@/types/products";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ShareProduct from "./ShareProduct";

interface QuickViewProps {
  children: React.ReactNode;
  productId: number | string;
}

export default function QuickVIew({ children, productId }: QuickViewProps) {
  const [open, setOpen] = useState(false);
  const [conductorType, setConductorType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  // const [bookmarked, setBookmarked] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const { addToCart } = useCartStore();

  const { productDetails, fetchProductDetails, isLoading } = useProductsStore();

  // Load product details when dialog opens
  useEffect(() => {
    if (open && productId) {
      const idNum = typeof productId === "string" ? parseInt(productId) : productId;
      if (!Number.isNaN(idNum)) {
        fetchProductDetails(idNum);
      }
    }
  }, [open, productId, fetchProductDetails]);

  // Derive convenience variables
  const details: ProductDetails | null = productDetails || null;
  const hasAttributes = !!details && Array.isArray(details.productAttributes) && details.productAttributes.length > 0;
  const conductorAttribute = useMemo(
    () => (hasAttributes ? details!.productAttributes.find((a) => a.attributeControlType === "RadioList") : undefined),
    [hasAttributes, details]
  );
  const colorAttribute = useMemo(
    () => (hasAttributes ? details!.productAttributes.find((a) => a.attributeControlType === "ImageSquares" || a.attributeControlType === "ColorSquares") : undefined),
    [hasAttributes, details]
  );

  const conductorOptions = useMemo(
    () =>
      (conductorAttribute?.values.map((v) => ({ value: v.name, label: v.name, price: v.priceAdjustmentValue, isDefault: v.isPreSelected })).filter((o) => o.value) as {
        value: string;
        label: string;
        price: number;
        isDefault: boolean;
      }[]) || [],
    [conductorAttribute]
  );

  const colors = useMemo(
    () =>
      (colorAttribute?.values
        .filter((v) => (v.nameColor || v.colorSquaresRgb || v.imageSquaresPictureModel?.imageUrl) && v.name)
        .map((v) => ({
          name: v.name,
          nameColor: v.nameColor,
          bg: v.nameColor || v.colorSquaresRgb || "",
          rgb: v.nameColor || v.colorSquaresRgb || "",
          imageUrl: v.imageSquaresPictureModel?.imageUrl || null,
          thumbImageUrl: v.imageSquaresPictureModel?.thumbImageUrl || null,
          fullSizeImageUrl: v.imageSquaresPictureModel?.fullSizeImageUrl || null,
        })) as Array<{
        name: string;
        nameColor: string | null;
        bg: string;
        rgb: string;
        imageUrl: string | null;
        thumbImageUrl: string | null;
        fullSizeImageUrl: string | null;
      }>) || [],
    [colorAttribute]
  );

  // Initialize defaults when product details load
  useEffect(() => {
    if (!details) return;
    if (conductorType === "" && conductorOptions.length > 0) {
      const def = conductorOptions.find((o) => o.isDefault) || conductorOptions[0];
      setConductorType(def.value);
    }
    if (selectedColor === "" && colors.length > 0) {
      const pre = colorAttribute?.values.find((v) => v.isPreSelected);
      setSelectedColor(pre ? pre.name : colors[0].name);
    }
  }, [details, conductorType, conductorOptions, selectedColor, colors, colorAttribute]);

  const rawPrice = productDetails?.price_value || 0;

  // multiply by quantity
  const totalPrice = rawPrice * quantity;

  // show result in Arabic decimal format
  const displayPrice = `${totalPrice.toFixed(2).replace(".", "٫")} ${productDetails?.currency_code}`;

  // Images: color images first then picture_models
  const getSwipeImages = () => {
    const colorImages = colors.map((c) => c.fullSizeImageUrl).filter(Boolean) as string[];
    const productImages = [details?.defaultImage, ...(details?.pictureImages || [])].filter(Boolean) as string[];
    if (colorImages.length > 0) {
      const appendedUnique = productImages.filter((img) => !colorImages.includes(img));
      return [...colorImages, ...appendedUnique];
    }
    return productImages;
  };
  const allImages = getSwipeImages();

  // Build attributes
  const buildProductAttributes = () => {
    if (!details) return [] as { attributeId: number; valueId: number }[];
    const attributes: { attributeId: number; valueId: number }[] = [];
    details.productAttributes.forEach((attr) => {
      let chosenValueId: number | undefined;
      if (conductorAttribute && attr.id === conductorAttribute.id && conductorType) {
        chosenValueId = conductorAttribute.values.find((v) => v.name === conductorType)?.id;
      } else if (colorAttribute && attr.id === colorAttribute.id && selectedColor) {
        chosenValueId = colorAttribute.values.find((v) => v.name === selectedColor)?.id;
      } else {
        chosenValueId = attr.values.find((v) => v.isPreSelected)?.id;
      }
      if (attr.id !== undefined && chosenValueId !== undefined) {
        attributes.push({ attributeId: attr.id, valueId: chosenValueId });
      }
    });
    return attributes;
  };

  const handleAddToCart = async () => {
    if (!details) return;
    const attrs = buildProductAttributes();
    await addToCart(details.breadcrumb.productId, quantity, attrs);
  };

  // const handleAddToWishlist = async () => {
  //   if (!details) return;
  //   const attrs = buildProductAttributes();
  //   await addToWishlist(details.breadcrumb.productId, quantity, attrs);
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle />
      <DialogDescription />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[110dvh] overflow-hidden  ">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto p-6 min-h-[600px] overflow-y-auto scrollbar mt-10 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product images swiper with custom arrows beside pagination at the bottom */}
              <div className="relative aspect-square rounded-lg ">
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
                  className="w-[85%] h-[85%]"
                >
                  {(allImages.length ? allImages : ["/product1.jpg"]).map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={img} alt={`${details?.name || "Product"} ${idx + 1}`} className="object-cover w-full h-full aspect-square " width={400} height={400} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Bottom controls: arrows + pagination */}
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
                  <div className="custom-swiper-pagination   " />
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
              <div className="flex flex-col space-y-4">
                {/* Header with title and action buttons */}
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-[#535353] mb-1">{details?.name || "Product"}</DialogTitle>
                    <DialogDescription className="text-xl font-extrabold text-gray-800">{details?.price}</DialogDescription>
                  </div>

                  <div className="flex gap-2">
                    <ShareProduct
                      productId={details?.breadcrumb.productId ? String(details.breadcrumb.productId) : ""}
                      iconClassName={"20"}
                      triggerClassName={"rounded-full size-8 text-[#F99E94] border border-[#F99E94] hover:bg-[#F99E94] hover:text-white  "}
                    />

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
                      <Bookmark className={`size-5 ${bookmarked ? "fill-[#F99E94]" : "fill-none"}`} />
                    </Button> */}
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-[#7D7D7D] leading-relaxed">
                  <p>{details?.shortDescription}</p>
                </div>
                <Separator className="my-4" />

                {/* Conductor Type */}
                {conductorAttribute && (
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

                {conductorAttribute && <Separator className="my-2" />}

                {/* Colors */}
                {colorAttribute && colors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-[#7A7A7A]">
                      {colorAttribute.name}: {selectedColor}
                      {colorAttribute.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <div className="flex gap-1 flex-wrap">
                      {colors.map((color) => (
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
                            <div
                              style={{ backgroundColor: color.nameColor }}
                              className={`w-6 h-6 rounded-full border-2 border-white transition-all ${
                                selectedColor === color.name ? "outline-1 outline-gray-600 scale-110" : " hover:border-gray-400"
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
                              className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-500"
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

                <Separator className="mt-2" />

                {/* Quantity and Add to Cart */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-[#F8F8F8] rounded-md">
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
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary hover:bg-red-700 text-white py-6 text-lg font-medium rounded-md flex justify-between items-center"
                    >
                      Add To Cart <span className="ml-2">{displayPrice}</span>
                    </Button>
                  </div>

                  {/* <div className="flex items-center text-sm text-primary">
                    <Info className="h-4 w-4 mr-1" />
                    <span>Minimum Quantity: 1 • Maximum Quantity: {details?.stockAvailability || 10000}</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
