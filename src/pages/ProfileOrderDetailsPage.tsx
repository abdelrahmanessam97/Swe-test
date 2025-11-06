import EmptyState from "@/components/empty-state/EmptyState";
import AddFeedback from "@/components/profile/AddFeedback";
import OrderProductTable from "@/components/profile/OrderProductTable";
import OrderStepper from "@/components/profile/OrderStepper";
import { useOrdersStore } from "@/stores/ordersStore";
import type { OrderDetails } from "@/types/orders";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ProfileOrderDetailsPage = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const { fetchOrderDetails, orderDetails, isLoading, error } = useOrdersStore();
  const details: OrderDetails | undefined = isNaN(numericId) ? undefined : orderDetails[numericId];

  useEffect(() => {
    if (!isNaN(numericId) && !details) {
      fetchOrderDetails(numericId);
    }
  }, [numericId, details, fetchOrderDetails]);

  // Loading / error / empty states
  if (!id || isNaN(numericId)) {
    return <EmptyState title="Invalid order" para="We couldn't identify this order." imgUrl="/order-empty.png" />;
  }

  if (isLoading && !details) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !details) {
    return <EmptyState title="Failed to load order" para={error} imgUrl="/order-empty.png" />;
  }

  if (!details) {
    return <EmptyState title="You have no orders yet." para="Start shopping now and enjoy a smooth, hassle-free purchasing experience." imgUrl="/order-empty.png" />;
  }

  return (
    <div className="w-full px-4 p-6 space-y-4">
      {/* Header */}
      <Link to={`/profile/order-history`} className="flex justify-start gap-2 items-center  pb-3 mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="text-primary">
            <ChevronLeft />
          </span>
          Order details
        </h2>
        <span className="text-sm text-gray-500 mt-1">• {new Date(details.created_on).toLocaleDateString()} </span>
        <span className="text-sm text-gray-500 mt-1">• {details.items?.length ?? 0} Products</span>
      </Link>

      {/* Stepper */}
      <OrderStepper currentStep={4} orderDetails={details} />

      {/* Products */}
      <OrderProductTable details={details} />

      {/* Feedback */}
      {/complete|delivered/i.test(details.order_status || "") && <AddFeedback />}
    </div>
  );
};

export default ProfileOrderDetailsPage;
