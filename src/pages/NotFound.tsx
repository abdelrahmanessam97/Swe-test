// import { useTranslation } from "react-i18next";

import { CornerUpLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  //   const { t, i18n } = useTranslation();
  //   const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden text-center space-y-8">
      <h1 className="text-4xl font-bold text-[#3A3A3A]">THIS PAGE NOT FOUND</h1>

      <p className=" lg:w-[680px] md:w-[500px] w-[370px] text-[#616161] text-center">
        Oops! It seems the page you’re looking for is lost in the wires. Explore our range of cables and electrical products, take advantage of special deals, enjoy quick
        checkout, track your orders, and verify product authenticity—whenever you need.
      </p>

      <Link
        to="/"
        type="button"
        className=" flex items-center justify-center gap-2 text-[#C21D0B] text-xl font-medium transition duration-300  border border-[#C21D0B]  hover:bg-[#C21D0B]  hover:text-white py-2 px-8 rounded-md"
      >
        <CornerUpLeft className="w-4 h-4" />
        Back To Home
      </Link>

      <img className="max-w-full w-[600px] me-0 ms-36 sm:ms-56" src="/404.png" alt="error" />
    </div>
  );
};

export default NotFound;
