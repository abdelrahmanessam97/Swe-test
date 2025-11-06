import type { OrderDetails } from "@/types/orders";
import { Info } from "lucide-react";

const OrderCustomerInfo = ({ details, currentStep }: { details?: OrderDetails; currentStep: number }) => {
  const isDelivered = currentStep === 4; // last step
  const isCancelled = (details?.order_status || "").toLowerCase().includes("cancel");

  return (
    <div className=" grid md:grid-cols-3 gap-6 pb-4 mb-4">
      <div className="md:col-span-2 space-y-5 bg-white rounded-sm shadow-muted ">
        <div className=" border border-[#E6E6E6] rounded-sm p-4">
          <p className="mb-2 text-sm flex items-center justify-between border-b pb-3">
            <span className="font-[400] text-[#666666]">Name:</span>
            <span className="text-[#1A1A1A]">
              {" "}
              {details?.shipping_address?.first_name} {details?.shipping_address?.last_name}
            </span>
          </p>

          <p className="mb-2 text-sm flex items-center justify-between border-b pb-3">
            <span className="font-[400] text-[#666666]">Mobile number:</span>
            <span className="text-[#1A1A1A]"> {details?.shipping_address?.phone_number}</span>
          </p>

          <p className="mb-2 text-sm flex items-center justify-between border-b pb-3">
            <span className="font-[400] text-[#666666]">Email:</span>
            <span className="text-[#1A1A1A]"> {details?.shipping_address?.email}</span>
          </p>

          <p className="text-sm flex items-center justify-between">
            <span className="font-[400] text-[#666666]">Address:</span>
            <span className="text-[#1A1A1A]"> {details?.shipping_address?.address1}</span>
          </p>
        </div>
        <p className={`text-sm mt-2 px-4 flex items-center ${isCancelled ? "text-[#FF5506]" : isDelivered ? "text-[#34A853]" : "text-[#FF5506]"}`}>
          <Info size={16} className="me-2" />
          {isCancelled ? "Your order has been cancelled" : isDelivered ? "Your order has been delivered" : "Your order is being processed"}
        </p>
      </div>

      <div className="w-full mx-0 md:mx-auto md:w-fit md:col-span-1 text-nowrap p-4  border bg-white rounded-sm shadow-muted">
        <div className="flex items-center justify-between md:justify-center border-b pb-4 gap-5 mb-4">
          <p className="flex items-start md:items-start justify-between flex-col text-xs border-0 md:border-r pr-4">
            <span className="font-semibold text-[#999999]">ORDER ID:</span>
            <span className="font-semibold">#{details?.id}</span>
          </p>
          <p className="flex items-end md:items-start justify-between flex-col text-xs">
            <span className="font-semibold text-[#999999]">PAYMENT METHOD:</span>
            <span className="font-semibold">{details?.payment_method}</span>
          </p>
        </div>

        <div className="mt-2 space-y-1 text-sm">
          <p className="flex justify-between text-[#666666] border-b pb-4">
            <span>Subtotal:</span>
            <span className="text-[#1A1A1A]">{details?.order_subtotal}</span>
          </p>
          <p className="flex justify-between text-[#666666] border-b pb-4">
            <span>Discount:</span>
            <span className="text-[#1A1A1A]">20%</span>
          </p>
          <p className="flex justify-between text-[#666666] border-b pb-4">
            <span>Shipping:</span>
            <span className="text-[#1A1A1A]">{details?.order_shipping}</span>
          </p>
          <p className="flex justify-between  font-semibold text-primary text-lg">
            <span className="text-[#1A1A1A]">Total:</span> <span>{details?.order_total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
