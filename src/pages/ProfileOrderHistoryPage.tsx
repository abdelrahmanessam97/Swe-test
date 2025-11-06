import EmptyState from "@/components/empty-state/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrdersStore } from "@/stores/ordersStore";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  Processing: "bg-[#F0F6FF] text-[#4285F4]  border border-[#4285F424]",
  Completed: "bg-[#E6F4EA] text-[#34A853] border border-[#34A8531F]",
  Cancelled: "bg-[#EAEAEA] text-[#545454] border border-[#C7C7C724]",
} as const;

const ProfileOrderHistoryPage = () => {
  const [tab, setTab] = useState("ongoing");
  const { orders, isLoading, error, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const normalizeStatus = useMemo(
    () =>
      (status: string): keyof typeof statusStyles => {
        if (status === "Complete") return "Completed";
        return status as keyof typeof statusStyles;
      },
    []
  );

  const filteredOrders = useMemo(() => (tab === "ongoing" ? orders.filter((order) => order.order_status === "Processing") : orders), [orders, tab]);
  return (
    <section id="order-history">
      <h3 className="text-[#3D3D3D] text-2xl font-bold mb-4">Orders History</h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <EmptyState title="Couldn’t load orders." para={error} imgUrl="/order-empty.png" />
      ) : orders.length > 0 ? (
        <Tabs defaultValue="ongoing" onValueChange={setTab}>
          <TabsList className="mb-4 flex w-[25%] justify-start gap-6">
            <TabsTrigger
              value="ongoing"
              className="w-1/2 text-center py-6 text-[#505050] !shadow-none font-medium !rounded-none
                         data-[state=active]:border-b-2 data-[state=active]:border-b-primary
                         data-[state=active]:text-primary data-[state=active]:font-bold 
                         data-[state=active]:bg-transparent transition-all"
            >
              Ongoing
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="w-1/2 text-center py-6 text-[#505050] !shadow-none font-medium !rounded-none
                         data-[state=active]:border-b-2 data-[state=active]:border-b-primary
                         data-[state=active]:text-primary data-[state=active]:font-bold 
                         data-[state=active]:bg-transparent transition-all"
            >
              History
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[400px] overflow-y-auto scrollbar mt-6 bg-white">
            <TabsContent value="ongoing">
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="flex items-start justify-between gap-4 p-4 bg-white border rounded-sm">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/order-history/${order.id}`} className="text-sm font-medium text-[#000]">
                            Order #{order.id}
                          </Link>
                          <Link to={`/profile/order-history/${order.id}`} className="text-sm text-primary underline cursor-pointer">
                            View details
                          </Link>
                        </div>

                        <Link to={`/profile/order-history/${order.id}`} className="mt-2 text-xs text-[#7A7A7A]">
                          <span className="text-[#3D3D3D] font-bold">{order.order_total}</span>
                        </Link>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <Link
                            to={`/profile/order-history/${order.id}`}
                            className={`text-xs font-medium px-3 py-1 rounded-lg ${statusStyles[normalizeStatus(order.order_status)] || "bg-gray-100 text-gray-700"}`}
                          >
                            {order.order_status}
                          </Link>

                          <span className="text-xs text-[#706F6F]">{new Date(order.created_on).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="You have no ongoing orders." para="Start shopping now and track your orders here." imgUrl="/order-empty.png" />
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-start justify-between gap-4 p-4 bg-white border rounded-sm">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link to={`/profile/order-history/${order.id}`} className="text-sm font-medium text-[#000]">
                          Order #{order.id}
                        </Link>
                        <Link to={`/profile/order-history/${order.id}`} className="text-sm text-primary underline cursor-pointer">
                          View details
                        </Link>
                      </div>

                      <Link to={`/profile/order-history/${order.id}`} className="mt-2 text-xs text-[#7A7A7A]">
                        <span className="ml-2 text-[#3D3D3D] font-bold">{order.order_total}</span>
                      </Link>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Link
                          to={`/profile/order-history/${order.id}`}
                          className={`text-xs font-medium px-3 py-1 rounded-lg ${statusStyles[normalizeStatus(order.order_status)] || "bg-gray-100 text-gray-700"}`}
                        >
                          {order.order_status}
                        </Link>

                        <span className="text-xs text-[#706F6F]">{new Date(order.created_on).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <EmptyState title="You have no orders yet." para="Start shopping now and enjoy a smooth, hassle-free purchasing experience." imgUrl="/order-empty.png" />
      )}
    </section>
  );
};

export default ProfileOrderHistoryPage;
