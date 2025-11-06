import OrderSummary from "@/components/cart/OrderSummary";
import CheckoutAuth from "@/components/checkout/CheckoutAuth";
import CheckoutCart from "@/components/checkout/CheckoutCart";
// import CheckoutConfirmPayment from "@/components/checkout/CheckoutConfirmPayment";
import CheckoutOrderPlace from "@/components/checkout/CheckoutOrderPlace";
import CheckoutPaymentMethod from "@/components/checkout/CheckoutPaymentMethod";
import CheckoutPersonalInfo from "@/components/checkout/CheckoutPersonalInfo";
import EmptyState from "@/components/empty-state/EmptyState";
import Products from "@/components/home/Products";
import ValuesSections from "@/components/home/ValuesSections";
import Loading from "@/components/loading/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";
import { Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<boolean>(true);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);

  // const [confirmPayment, setConfirmPayment] = useState<boolean>(false);
  const [orderPlace, setOrderPlace] = useState<boolean>(false);

  const [checkoutStep, setCheckoutStep] = useState<number>(0);
  const nextStep = () => setCheckoutStep((prev) => prev + 1);
  const prevStep = () => setCheckoutStep((prev) => prev - 1);

  // Use cart store instead of local state
  const { cartItems, isLoading, updatingItemId, removingItemId, error, subtotal, discount, total, fetchCartItems, updateQuantity, removeItem } = useCartStore();
  const { relatedProducts, fetchRelatedProducts, homePageProducts, fetchHomePageProducts } = useProductsStore();

  const [appliedCoupon, setAppliedCoupon] = useState<boolean>(false);
  const [couponMessage, setCouponMessage] = useState<string>("");

  const applyDiscount = () => {
    setAppliedCoupon(true);
    setCouponMessage("Coupon Applied Successfully");
    setTimeout(() => {
      setAppliedCoupon(false);
      setCouponMessage("");
    }, 3000);
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  const addQuantity = (productId: number) => {
    const item = cartItems.find((item) => item.product_id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const removeQuantity = (productId: number) => {
    const item = cartItems.find((item) => item.product_id === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  useEffect(() => {
    // Fetch cart items when component mounts
    fetchCartItems();
  }, [fetchCartItems]);

  // Fetch related products based on first cart item or fallback to home page products
  useEffect(() => {
    if (cartItems.length > 0) {
      // Use the first product in cart to fetch related products
      const firstProductId = cartItems[0].product_id;
      fetchRelatedProducts(firstProductId);
    } else if (homePageProducts.length === 0) {
      // Fallback to home page products if cart is empty
      fetchHomePageProducts();
    }
  }, [cartItems, fetchRelatedProducts, homePageProducts.length, fetchHomePageProducts]);

  const handleCheckout = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setCheckoutStep(1);
  };

  const handleLogin = () => {
    setUser(false);
    setShowAuthDialog(false);
    navigate("/auth/login");
  };

  // const handleOrderPlace = () => {
  //   setOrderPlace(true);
  //   setConfirmPayment(false);
  // };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <section className="main-p ">
        <div className="container mx-auto p-6 text-center">
          <div className="text-red-500">Error loading cart: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-p !pt-0 ">
      {cartItems.length > 0 ? (
        <>
          <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {checkoutStep === 0 ? (
              <>
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="font-bold text-2xl p-4 pb-0">Cart</h2>
                    <div className="text-primary">{cartItems.length} items</div>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-start justify-between not-last:border-b">
                      <div className="flex gap-4 items-center">
                        <img src={item.image_url} alt={item.product_name} className="w-[143px] h-[132px] rounded" />
                        <div>
                          <h3 className="font-semibold mb-2">{item.product_name}</h3>
                          {/* <p className="text-sm text-primary">Product ID: {item.product_id}</p> */}

                          <div className="flex sm:hidden mb-4 items-center justify-between h-full">
                            <p className="font-semibold">{item.unit_price} </p>
                            <Button
                              variant="link"
                              className="text-gray-500 hover:text-primary inline-block"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product_id)}
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
                              className="text-gray-500 hover:text-primary p-2 disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:text-gray-500"
                              onClick={() => removeQuantity(item.product_id)}
                              disabled={updatingItemId === item.product_id || removingItemId === item.product_id || item.quantity === 1}
                            >
                              <Minus size={18} />
                            </button>
                            {updatingItemId === item.product_id ? <Loader2 size={18} className="animate-spin text-primary" /> : <span>{item.quantity}</span>}
                            <button
                              type="button"
                              className="text-gray-500 hover:text-primary p-3 disabled:!opacity-50 disabled:!cursor-not-allowed disabled:!hover:text-gray-500"
                              onClick={() => addQuantity(item.product_id)}
                              disabled={updatingItemId === item.product_id || removingItemId === item.product_id}
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end justify-between h-full">
                        <p className="font-semibold">{item.unit_price} </p>
                        <Button
                          variant="link"
                          className="text-gray-500 hover:text-primary inline-block"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product_id)}
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
                  ))}
                </div>
              </>
            ) : (
              <>
                {checkoutStep === 1 && (
                  <CheckoutCart
                    onNext={nextStep}
                    cartItems={cartItems}
                    isLoading={isLoading}
                    updatingItemId={updatingItemId}
                    removingItemId={removingItemId}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                )}
                {checkoutStep === 2 && <CheckoutPersonalInfo onNext={nextStep} onBack={prevStep} />}
                {checkoutStep === 3 && <CheckoutPaymentMethod onBack={prevStep} />}
              </>
            )}
            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
              checkoutStep={checkoutStep}
              onCheckout={handleCheckout}
              setOrderPlace={setOrderPlace}
              // onConfirmPayment={() => setConfirmPayment(true)}
              appliedCoupon={appliedCoupon}
              couponMessage={couponMessage}
              onApplyCoupon={applyDiscount}
            />
          </div>
        </>
      ) : (
        <>
          <div className="container mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-bold text-2xl p-4 pb-0">Cart</h2>
              <div className="text-primary">{cartItems.length} items</div>
            </div>
          </div>
          <EmptyState
            title="Your cart is empty"
            para="Start shopping now and enjoy a smooth, hassle-free purchasing experience."
            imgUrl="/checkout-empty-state-img.png"
          />
        </>
      )}
      <div className="my-10"></div>
      <ValuesSections />
      <div className="my-10"></div>
      <Separator />
      {relatedProducts.length > 0 ? (
        <Products title="Related Products" link="/products" linkText="Find out more" products={relatedProducts} activeArrow />
      ) : (
        // : homePageProducts.length > 0 ? (
        //   <Products title="Featured Products" link="/products" linkText="Find out more" products={homePageProducts} activeArrow />
        // )
        ""
        // <section className="py-12">
        //   <div className="container">
        //     <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-8">Related Products</h2>
        //     <div className="flex flex-col items-center justify-center py-16 text-center">
        //       <div className="text-gray-400 mb-4">
        //         <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        //         </svg>
        //       </div>
        //       <h3 className="text-xl font-semibold text-gray-600 mb-2">No Related Products</h3>
        //       <p className="text-gray-500 max-w-md">Check out our other products in the meantime.</p>
        //     </div>
        //   </div>
        // </section>
      )}
      <CheckoutAuth showAuthDialog={showAuthDialog} setShowAuthDialog={setShowAuthDialog} handleLogin={handleLogin} />
      {/* <CheckoutConfirmPayment confirmPayment={confirmPayment} setConfirmPayment={setConfirmPayment} handleOrderPlace={handleOrderPlace} /> */}
      {orderPlace && <CheckoutOrderPlace orderPlace={orderPlace} setOrderPlace={setOrderPlace} />}
    </section>
  );
}
