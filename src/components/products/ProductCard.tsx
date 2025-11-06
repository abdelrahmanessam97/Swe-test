import { getLanguageFromPath } from "@/utils/pathLanguage";
import { Columns2, Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";
import QuickVIew from "./QuickVIew";
import ShareProduct from "./ShareProduct";

// Define proper interface for product data
export interface ProductCardData {
  id: number | string;
  title: string;
  summary?: string;
  price: string | number;
  image: string;
  currency?: string;
}

interface ProductCardProps {
  item: ProductCardData;
}

export default function ProductCard({ item }: ProductCardProps) {
  const currentLang = getLanguageFromPath() || "en";

  // Normalize the data with defaults
  const product = {
    id: item.id,
    title: item.title || "Untitled Product",
    summary: item.summary || "",
    price: item.price || "0.00",
    image: item.image || "/placeholder.webp",
    currency: item.currency || "",
  };

  return (
    <div className="group relative  border rounded-lg border-gray-200 max-w-[96%] h-[400px] md:h-[450px]">
      {/* Overlay with Lucide icons and Add to Cart button on hover */}
      <div className="absolute inset-0 hidden sm:!flex flex-col items-center justify-center p-3 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-20 rounded-lg">
        {/* Add to Cart Button */}
        <QuickVIew productId={product.id as number}>
          <button
            type="button"
            className="mb-5 flex items-center justify-center gap-2 px-4 py-3 w-full text-center rounded bg-white text-primary font-semibold"
            title="Add to Cart"
          >
            Add to Cart
          </button>
        </QuickVIew>

        {/* Icons */}
        <div className="flex gap-3">
          <Link
            to={`/products/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-full border border-white text-white bg-[#ffffff48] group/icon"
            title="Details"
          >
            <Ellipsis size={30} className="font-extrabold" />
          </Link>

          <ShareProduct
            productId={String(product.id)}
            iconClassName="25"
            triggerClassName="h-[40px] w-[40px] flex items-center justify-center rounded-full border !border-white !text-white !bg-[#ffffff48] group/icon"
          />

          <Link
            to={`/${currentLang}/products/compare/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-full border !border-white !text-white !bg-[#ffffff48] group/icon"
            title="Compare Product"
          >
            <Columns2 className="size-5" />
          </Link>

          {/* <Link
            to={`/products/save/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-full border border-white text-white bg-[#ffffff48] group/icon"
            title="Wishlist"
          >
            <Bookmark size={22} className="font-extrabold" />
          </Link> */}
        </div>
      </div>

      <div>
        <div className="aspect-3/2 flex ">
          <div className="flex-1">
            <Link
              to={`/products/${product.id}`}
              onClick={() => window.scrollTo(0, 0)}
              className="flex sm:!hidden  relative h-full w-full overflow-hidden rounded-lg rounded-b-none"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-full transition duration-300 group-hover:scale-105 w-full object-cover object-center rounded-lg rounded-b-none"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp"; // Fallback image
                }}
              />
            </Link>
            <div className="hidden sm:!flex  relative h-full w-full overflow-hidden rounded-lg rounded-b-none">
              <img
                src={product.image}
                alt={product.title}
                className="h-full transition duration-300 group-hover:scale-105 w-full object-cover object-center rounded-lg rounded-b-none"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp"; // Fallback image
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <div>
          <Link
            to={`/products/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="flex sm:!hidden !my-0 break-words text-lg font-medium md:mb-3 md:text-xl lg:text-2xl text-[#535353] line-clamp-2"
          >
            {product.title.length > 40 ? product.title.slice(0, 40) + "..." : product.title}
          </Link>
          <p className="hidden sm:!flex !my-0 break-words text-lg font-medium md:mb-3 md:text-xl lg:text-2xl text-[#535353] line-clamp-2">
            {product.title.length > 40 ? product.title.slice(0, 40) + "..." : product.title}
          </p>
          <div className="mt-2">
            {product.summary && (
              <p className="text-muted-foreground line-clamp-2 text-sm md:text-base ">
                {product.summary.length > 45 ? product.summary.slice(0, 40) + "..." : product.summary}
              </p>
            )}
          </div>
          <p className="flex items-center text-lg font-bold mt-2">
            {product.price} {product.currency}
          </p>
        </div>

        <div>
          {/* <QuickVIew productId={product.id as number}>
            <button type="button" className="flex sm:!hidden items-center justify-center outline-none border-none shadow-none" title="Add to Cart">
              <CirclePlus className="w-7 h-7 text-primary" />
            </button>
          </QuickVIew> */}
        </div>
      </div>
    </div>
  );
}
