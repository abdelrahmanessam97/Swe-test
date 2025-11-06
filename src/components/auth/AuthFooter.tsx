import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <div className="py-6 px-4 border-t flex items-center justify-between flex-wrap gap-4 w-full">
      <p className=" text-md  text-[#7a7a7a]"> Copyright &copy; 2025 Elsewedy Electronics</p>
      <p className="text-md  text-[#2c2c2c] flex flex-wrap">
        <span className="mr-1 text-[#7a7a7a]">All rights reserved</span>
        <span className="mr-1 text-[#E1E4ED]">|</span>
        <Link to="/terms-and-conditions" className="mr-1 underline">
          Terms and Conditions
        </Link>
        <span className="mr-1 text-[#E1E4ED]">|</span>
        <Link to="/privacy-policy" className="mr-1 underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;
