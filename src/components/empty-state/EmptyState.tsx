import { CornerUpLeft } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  para: string;
  imgUrl: string;
  activeLink?: boolean;
};
const EmptyState = ({ title, para, imgUrl, activeLink }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <img src={imgUrl} width={80} height={50} alt="empty state image" />
      <h3 className="text-xl font-semibold text-[#3A3A3A]">{title}</h3>
      <p className="max-w-[550px] text-center text-[#535353] mb-4">{para}</p>
      {activeLink && (
        <Link
          to="/products"
          type="button"
          className=" flex items-center justify-center gap-2 text-[#C21D0B] text-xl font-medium transition duration-300  border border-[#C21D0B]  hover:bg-[#C21D0B]  hover:text-white py-2 px-8 rounded-md"
        >
          <CornerUpLeft className="w-4 h-4" />
          Go To Products
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
