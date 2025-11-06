import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  showAuthDialog: boolean;
  setShowAuthDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => void;
};
const CheckoutAuth = ({ handleLogin, showAuthDialog, setShowAuthDialog }: Props) => {
  return (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[400px] transition-all duration-300
                     data-[state=open]:animate-in 
                     data-[state=open]:slide-in-from-top-10 
                     data-[state=open]:fade-in-0
                     data-[state=closed]:animate-out 
                     data-[state=closed]:fade-out-0"
      >
        <div className="flex flex-col space-y-3">
          <div className="w-8 h-8 flex items-center">
            <img src="/registeration-popup.png" alt="" className="w-full object-cover" />
          </div>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold">Please login or register</DialogTitle>
            <DialogDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Login to continue and access your account.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full grid grid-cols-1 gap-2">
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutAuth;
