import { useAuthStore } from "@/stores/authStore";
import { isAuthenticated } from "@/utils/auth/token";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  orderPlace: boolean;
  setOrderPlace: React.Dispatch<React.SetStateAction<boolean>>;
};
const CheckoutOrderPlace = ({ orderPlace, setOrderPlace }: Props) => {
  // Auth store
  const { isUserLoggedIn } = useAuthStore();

  // Check if user is authenticated
  const userIsAuthenticated = isAuthenticated() && isUserLoggedIn;

  return (
    <Dialog open={orderPlace} onOpenChange={setOrderPlace}>
      <DialogContent
        aria-describedby={undefined}
        className="w-full sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px]
                   transition-all duration-300 rounded-2xl shadow-lg
                   data-[state=open]:animate-in 
                   data-[state=open]:slide-in-from-top-10 
                   data-[state=open]:fade-in-0
                   data-[state=closed]:animate-out 
                   data-[state=closed]:fade-out-0"
      >
        <DialogHeader className="flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full flex items-center justify-center self-center">
            <img src="/check.png" alt="Success" className="w-full object-cover" />
          </div>

          <DialogTitle className="text-2xl font-bold text-gray-800">Order Placed Successfully</DialogTitle>

          <DialogDescription className="text-base text-gray-500">
            Thank you for shopping with <span className="font-semibold">El Sewedy</span>. Your order has been confirmed and is on its way.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex flex-col gap-3">
            {userIsAuthenticated && (
              <Link to={"/profile/order-history"} className="w-full">
                <Button className="w-full text-base py-6 rounded-xl">Order Summary</Button>
              </Link>
            )}

            <Link to={"/"} className="text-center underline text-gray-400 hover:text-primary">
              Back To Home
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutOrderPlace;
