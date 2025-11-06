import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "../empty-state/EmptyState";

const notifications = [
  { id: 1, title: "Order Shipped", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 2, title: "New Offer", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 3, title: "Password Changed", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 4, title: "Password Changed", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 5, title: "Password Changed", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 6, title: "Password Changed", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
  { id: 7, title: "Password Changed", message: "Thank you for shopping with Elsewedy! Your order has been received and is being processed.", date: "2 hours ago" },
];

const NotificationsSheet = () => {
  return (
    <Sheet>
      <SheetTrigger className="w-full flex items-center justify-between px-2 py-1 hover:text-primary transition-colors duration-300">
        <span className="text-sm">Notification</span>
        <ChevronRight className="w-4 h-4 ms-auto group-hover:text-primary transition-colors" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px] sm:w-[380px] max-h-[600px] overflow-y-scroll scrollbar px-4">
        <SheetTitle className=" text-md font-bold uppercase flex items-center gap-1 border-b border-[#D1D1D1] py-5">
          <ChevronLeft className="w-5 h-5 text-primary" />
          Notifications
        </SheetTitle>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="p-3 border-b w-[95%] border-[#D1D1D1] hover:bg-[#F5F5F5] transition-colors cursor-pointer">
                <p className="text-sm font-medium text-[#616161]">{n.title}</p>
                <p className="text-xs text-[#7A7A7A]">{n.message}</p>
                <p className="text-xs text-[#7A7A7A] mt-3 ">{n.date}</p>
              </div>
            ))
          ) : (
            <div className="w-[85%] mx-auto">
              <EmptyState title="No notifications yet." para="Once you start shopping, we’ll keep you updated here." imgUrl="/notifications.png" />
            </div>
          )}
        </div>
        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSheet;
