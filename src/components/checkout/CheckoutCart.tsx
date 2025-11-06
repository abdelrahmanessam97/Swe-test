import type { CartItem } from "@/types/cart";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import Loading from "../loading/Loading";
import { Button } from "../ui/button";

type Props = {
  onNext: () => void;
  cartItems: CartItem[];
  isLoading: boolean;
  updatingItemId: number | null;
  removingItemId: number | null;
  onUpdateQuantity: (productId: number, quantity: number) => Promise<void>;
  onRemoveItem: (productId: number) => Promise<void>;
};

const CheckoutCart = ({ onNext, cartItems, isLoading, updatingItemId, removingItemId, onUpdateQuantity, onRemoveItem }: Props) => {
  const increaseQuantity = (productId: number, currentQuantity: number) => {
    onUpdateQuantity(productId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(productId, currentQuantity - 1);
    }
  };
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center text-xs sm:text-sm md:text-base font-medium w-full">
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-primary">
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-primary bg-primary text-white text-xs sm:text-sm">1</div>
            <span className="text-center sm:text-left">Cart</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs sm:text-sm">2</div>
            <span className="text-center sm:text-left">Personal info</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs sm:text-sm">3</div>
            <span className="text-center sm:text-left">Payment method</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
      </div>

      <div className="border p-4 rounded">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="font-bold text-xl p-4 pb-0">Products</h2>
          <div className="text-primary">{cartItems.length} items</div>
        </div>

        {isLoading ? (
          <Loading />
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Your cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="p-4 flex items-start justify-between not-last:border-b">
              <div className="flex gap-4 items-center">
                <img src={item.image_url} alt={item.product_name} className="w-[143px] h-[132px] rounded" />
                <div>
                  <h3 className="font-semibold mb-2">{item.product_name}</h3>
                  {/* <p className="text-sm text-primary">Product ID: {item.product_id}</p> */}
                  {/* <p className="text-sm text-gray-500">Unit Price: {item.unit_price} </p> */}

                  <div className="flex sm:hidden items-center justify-between mb-4 h-full">
                    <p className="font-semibold">{item.sub_total} </p>
                    <Button
                      variant="link"
                      className="text-gray-500 hover:text-primary inline-block"
                      size="sm"
                      onClick={() => onRemoveItem(item.product_id)}
                      disabled={removingItemId === item.product_id}
                    >
                      {removingItemId === item.product_id ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Loader2 size={14} className="animate-spin mr-1" />
                          Removing...
                        </div>
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center bg-gray-100 gap-2 w-fit">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-primary p-2 disabled:opacity-50 disabled:!cursor-not-allowed disabled:hover:text-gray-500"
                      onClick={() => decreaseQuantity(item.product_id, item.quantity)}
                      disabled={updatingItemId === item.product_id || removingItemId === item.product_id || item.quantity === 1}
                    >
                      <Minus size={18} />
                    </button>
                    {updatingItemId === item.product_id ? <Loader2 size={18} className="animate-spin text-primary" /> : <span>{item.quantity}</span>}
                    <button
                      type="button"
                      className="text-gray-500 hover:text-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                      onClick={() => increaseQuantity(item.product_id, item.quantity)}
                      disabled={updatingItemId === item.product_id || removingItemId === item.product_id}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end justify-between h-full">
                <p className="font-semibold">{item.sub_total} </p>
                <Button
                  variant="link"
                  className="text-gray-500 hover:text-primary inline-block"
                  size="sm"
                  onClick={() => onRemoveItem(item.product_id)}
                  disabled={removingItemId === item.product_id}
                >
                  {removingItemId === item.product_id ? (
                    <div className="flex items-center gap-1 text-xs">
                      <Loader2 size={14} className="animate-spin mr-1" />
                      Removing...
                    </div>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold" onClick={onNext}>
          Next
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CheckoutCart;
