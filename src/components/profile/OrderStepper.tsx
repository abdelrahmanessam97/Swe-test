import type { OrderDetails } from "@/types/orders";
import { Check } from "lucide-react";
import OrderCustomerInfo from "./OrderCustomerInfo";

type Step = { id: number; label: string };

const steps: Step[] = [
  { id: 1, label: "Order received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "On the way" },
  { id: 4, label: "Delivered" },
];

const OrderStepper = ({ currentStep, orderDetails }: { currentStep: number; onStepChange?: (step: number) => void; orderDetails?: OrderDetails }) => {
  const normalizedStatus = (orderDetails?.order_status || "").toLowerCase();
  const normalizedShipping = (orderDetails?.shipping_status || "").toLowerCase();

  const isCancelled = normalizedStatus.includes("cancel");
  const isCompleted = normalizedStatus.includes("complete") || normalizedStatus.includes("delivered");
  const isProcessing = normalizedStatus.includes("process") || normalizedStatus.includes("pending") || normalizedShipping.includes("not yet shipped");

  const derivedStep = isCancelled ? 1 : isCompleted ? 4 : isProcessing ? 2 : currentStep;

  const progressPercent = isCancelled ? 0 : derivedStep === steps.length ? 100 : ((derivedStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <div className="relative w-full flex items-center justify-between overflow-x-hidden">
        {/* track background */}
        <div className="absolute top-5 left-[30px] right-[30px] h-[5px] bg-gray-200">
          {/* progress line */}
          <div className={`h-full transition-all duration-400 ${isCancelled ? "bg-[#FF5506]" : "bg-[#34A853]"}`} style={{ width: `${progressPercent}%` }} />
        </div>

        {steps.map((stepObj) => {
          const isCompleted = stepObj.id < derivedStep || (stepObj.id === derivedStep && derivedStep === steps.length);
          const isActive = stepObj.id === derivedStep && derivedStep !== steps.length;

          return (
            <div
              key={stepObj.id}
              className="flex flex-col items-center z-10"
              // onClick={() => onStepChange?.(stepObj.id)} // send to parent
            >
              <div
                className={
                  `w-10 h-10 flex items-center justify-center rounded-full border-2  ` +
                  (isCancelled && stepObj.id === steps.length
                    ? "bg-[#FF5506] border-[#FF5506] text-white"
                    : isCompleted
                    ? "bg-[#34A853] border-[#34A853] text-white"
                    : isActive
                    ? "bg-[#616161] border-[#616161] text-white"
                    : "bg-white border-gray-300 text-[#B3B3B3]")
                }
              >
                {isCompleted ? <Check size={18} /> : stepObj.id.toString().padStart(2, "0")}
              </div>

              <span
                className={
                  `mt-2 text-sm text-center ` +
                  (isCancelled && stepObj.id === steps.length
                    ? "text-[#FF5506] font-semibold"
                    : isCompleted
                    ? "text-[#34A853]"
                    : isActive
                    ? "text-[#616161] font-semibold"
                    : "text-[#B3B3B3]")
                }
              >
                {isCancelled && stepObj.id === steps.length ? "Cancelled" : stepObj.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Customer Info */}
      <OrderCustomerInfo details={orderDetails} currentStep={derivedStep} />
    </>
  );
};

export default OrderStepper;
