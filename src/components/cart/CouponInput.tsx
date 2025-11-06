import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CouponInputProps {
  onApplyCoupon: () => void;
  appliedCoupon: boolean;
  couponMessage: string;
}

export default function CouponInput({ onApplyCoupon, appliedCoupon, couponMessage }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");

  const handleApply = () => {
    if (couponCode.trim()) {
      onApplyCoupon();
    }
  };

  return (
    <>
      <div className="flex justify-between bg-white p-2 rounded-3xl">
        <input
          placeholder="Add promo code"
          className="focus:outline-none border-none outline-none bg-transparent pl-4"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button variant="link" className="text-primary" onClick={handleApply}>
          Apply
        </Button>
      </div>

      {appliedCoupon && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg mt-2 transition-all duration-300 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{couponMessage}</span>
        </div>
      )}
    </>
  );
}
