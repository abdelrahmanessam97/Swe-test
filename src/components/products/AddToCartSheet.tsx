import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../empty-state/EmptyState";

interface AddToCartSheetProps {
  productTotalPrice: number | string;
  onAddToCart: () => Promise<void>;
}

const AddToCartSheet = ({ productTotalPrice, onAddToCart }: AddToCartSheetProps) => {
  const { cartItems, isLoading, updatingItemId, removingItemId, fetchCartItems, updateQuantity, removeItem, total } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const increaseQty = (productId: number, currentQty: number) => {
    updateQuantity(productId, currentQty + 1);
  };

  const decreaseQty = (productId: number, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="w-full bg-primary hover:bg-primary/60 text-white px-6 py-3 text-md font-[500] rounded-md flex justify-between items-center flex-wrap gap-2 disabled:opacity-50"
          onClick={async () => {
            await onAddToCart();
            // Refresh cart after adding item
            await fetchCartItems();
            // Open the sheet after adding to cart
            setIsOpen(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add To Cart"}
          <span className="ml-2 font-bold">{productTotalPrice}</span>
        </SheetTrigger>

        <SheetContent side="right" className="w-full max-w-md p-4 flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold">Your Cart</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex-1 h-[85%] overflow-y-auto scrollbar  space-y-3">
            {cartItems.length === 0 ? (
              <EmptyState
                title="Your cart is empty"
                para="Start shopping now and enjoy a smooth, hassle-free purchasing experience."
                imgUrl="/checkout-empty-state-img.png"
              />
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 p-3 border rounded-md bg-white">
                  <img src={item.image_url} alt={item.product_name} width={60} height={60} className="rounded-md border" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium w-3/4">{item.product_name}</h3>
                      <span className="text-sm font-semibold">{Math.floor(item._sub_total_value)} EGP</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="h-6 w-6 border rounded disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-transparent"
                        onClick={() => decreaseQty(item.product_id, item.quantity)}
                        disabled={updatingItemId === item.product_id || removingItemId === item.product_id || item.quantity === 1}
                      >
                        -
                      </button>
                      {updatingItemId === item.product_id ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : (
                        <span className="text-sm min-w-[20px] text-center">{item.quantity}</span>
                      )}
                      <button
                        type="button"
                        className="h-6 w-6 border rounded disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-transparent"
                        onClick={() => increaseQty(item.product_id, item.quantity)}
                        disabled={updatingItemId === item.product_id || removingItemId === item.product_id}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="ml-auto text-xs text-gray-500 underline hover:text-red-500 disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!text-gray-500 disabled:!no-underline flex items-center gap-1"
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
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show cart total */}
          <div className="mt-6 text-lg flex justify-between font-bold">
            <span>Total</span>
            <span>{Math.floor(total)} EGP</span>
          </div>

          <div className="space-y-3">
            <Link className="w-full block " to="/cart">
              <Button className="w-full bg-primary hover:bg-primary/60 text-white" disabled={cartItems.length === 0} onClick={() => window.scrollTo(0, 0)}>
                Checkout
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border border-[#535353] text-[#535353] hover:text-white hover:bg-primary hover:border-0"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddToCartSheet;
