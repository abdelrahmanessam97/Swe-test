import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  checkoutStep: number;
  onCheckout: () => void;
  // onConfirmPayment: () => void;
  setOrderPlace: React.Dispatch<React.SetStateAction<boolean>>;
  appliedCoupon: boolean;
  couponMessage: string;
  onApplyCoupon: () => void;
}

export default function OrderSummary({ subtotal, total, checkoutStep, onCheckout, setOrderPlace }: OrderSummaryProps) {
  const { confirmOrder, isLoading } = useCheckoutStore();
  const deliveryFee = 10;
  const finalTotal = checkoutStep === 3 ? total + deliveryFee : total;

  const handleConfirmPayment = async () => {
    try {
      const response = await confirmOrder();
      if (response?.redirect_to_method === "Completed") {
        setOrderPlace(true);
      }
    } catch (error) {
      console.error("Order confirmation failed:", error);
    }
  };

  return (
    <div>
      <div className="space-y-4 h-fit bg-gray-100 p-4 mb-4">
        <h2 className="font-bold text-lg">Order Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{subtotal} EGP</span>
        </div>

        {checkoutStep === 3 && (
          <div className="flex justify-between text-sm">
            <span>Delivery Fees</span>
            <span>{deliveryFee} EGP</span>
          </div>
        )}
        {/* <CouponInput onApplyCoupon={onApplyCoupon} appliedCoupon={appliedCoupon} couponMessage={couponMessage} /> */}

        <Separator />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>{finalTotal} EGP</span>
        </div>

        {checkoutStep === 3 ? (
          <Button className="w-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleConfirmPayment} disabled={isLoading}>
            {isLoading ? "Processing Order..." : "Confirm & Pay"}
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button
            className="w-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCheckout}
            disabled={checkoutStep > 0 && checkoutStep < 3}
          >
            Go To Checkout
            <ArrowRight size={18} />
          </Button>
        )}
      </div>

      {/* <div className="flex items-center justify-center mx-auto gap-2 bg-gray-100 p-4">
        <img src="/checkout-value.png" alt="valu checkout image" className="w-[102px] h-[27px]" />
        <small>
          Pay later on instalments up to <span className="text-primary">60 months</span>
        </small>
      </div> */}
    </div>
  );
}
