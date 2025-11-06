// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { ArrowLeft, Package } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onBack: () => void;
};

const CheckoutPaymentMethod = ({ onBack }: Props) => {
  const [method, setMethod] = useState<string>("cod");
  const { selectPaymentMethod, isLoading } = useCheckoutStore();

  useEffect(() => {
    if (method === "cod") {
      selectPaymentMethod();
    }
  }, [method, selectPaymentMethod]);
  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center justify-center text-xs sm:text-sm md:text-base font-medium w-full">
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs sm:text-sm">1</div>
            <span className="text-center sm:text-left">Cart</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">2</div>
            <span className="text-center sm:text-left">Personal info</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-primary">
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-primary bg-primary text-white text-xs sm:text-sm">3</div>
            <span className="text-center sm:text-left">Payment method</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
        </div>
      </div>
      <div className="border p-4 rounded">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h2 className="font-bold text-xl p-4 pb-0">Payment method</h2>
        </div>
        <div className="w-full mx-auto">
          <div>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-4">
              {/* Online Payment */}
              {/* <div className="border rounded-2xl p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center justify-between w-full cursor-pointer">
                    Online payment
                    <CreditCard className="h-7 w-7 text-gray-600" />
                  </Label>
                </div>
                {method === "online" && (
                  <div className="grid gap-3 pl-7">
                    <div className="flex gap-3">
                      <div className="flex flex-col flex-1 space-y-2">
                        <Label htmlFor="cardNumber">Card number</Label>
                        <Input id="cardNumber" placeholder="**** **** **** ****" />
                      </div>
                      <div className="flex flex-col w-[100px] space-y-2">
                        <Label htmlFor="expiry">Expiration date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="flex flex-col w-[80px] space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="***" />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name">Card holder name</Label>
                      <Input id="name" placeholder="Name example" />
                    </div>
                  </div>
                )}
              </div> */}

              {/* Value Card */}
              {/* <div className="border rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="valuecard" id="valuecard" />
                  <Label htmlFor="valuecard" className="flex items-center justify-between cursor-pointer w-full">
                    Value card
                    <Wallet className="h-7 w-7 text-gray-600" />
                  </Label>
                </div>
              </div> */}

              {/* Cash on Delivery */}
              <div className="border rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cod" id="cod" defaultValue="cod" disabled={isLoading} />
                  <Label htmlFor="cod" className="flex items-center justify-between cursor-pointer w-full">
                    <span className="flex items-center gap-2">
                      Cash on delivery
                      {isLoading && method === "cod" && <span className="text-xs text-gray-500">(Processing...)</span>}
                    </span>
                    <Package className="h-7 w-7 text-gray-600" />
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="flex">
        <button className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </div>
  );
};

export default CheckoutPaymentMethod;
