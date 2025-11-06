import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

type ShareProductProps = {
  productId: string;
  pageShareCode?: string;
  className?: string;
  triggerClassName?: string;
  iconClassName?: string;
};

const ShareProduct = ({ productId, ...props }: ShareProductProps) => {
  const [copied, setCopied] = useState(false);

  const productUrl = `https://app696267.prod.cudawaas.com/products/${productId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: "facebook" | "x" | "whatsapp") => {
    let shareUrl = "";
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    } else if (platform === "x") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(productUrl)}`;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger
        className={` flex items-center justify-center rounded-full size-10 text-[#F99E94] border border-[#F99E94] hover:bg-[#F99E94] hover:text-white ${props.triggerClassName} `}
      >
        <Share2 size={props.iconClassName} className={`size-6 fill-white ${props.iconClassName}`} />
        {/* <Share2 className={`size-6 fill-[#F99E94] ${props.className}`} />
          <DialogTrigger className=" h-[40px] w-[40px] flex items-center justify-center rounded-full border border-white text-white bg-[#ffffff48]  group/icon">        <Share2 size={25} className={` ${props.className}`} /> */}
      </DialogTrigger>
      <DialogContent className="!max-w-[400px] flex flex-col items-center space-y-3 py-6">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* Copy URL */}
        <div className="w-full flex items-center gap-2 bg-[#F5F5F5] border-0 px-3 py-2 mt-8">
          <button onClick={handleCopy} className="relative flex items-center justify-center text-gray-500 hover:text-gray-800 transition">
            {copied ? <Check className="size-5 text-green-600 transition-transform duration-300 scale-110" /> : <Copy className="size-5 text-[#569DD1]" />}
          </button>
          <input type="text" readOnly value={productUrl} className="flex-1  outline-none text-[#569DD1]" />
        </div>

        {/* Copy feedback message */}
        <div
          className={`absolute top-5 right-1/2 translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md transition-opacity duration-300 ${
            copied ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Link copied
        </div>

        {/* Social Share */}
        <div className="flex justify-center items-center gap-6">
          <button onClick={() => handleShare("facebook")} className="hover:scale-110 transition">
            <img src="/facebook.png" alt="Facebook" className="size-8" />
          </button>
          <button onClick={() => handleShare("x")} className="hover:scale-110 transition">
            <img src="/twitter.png" alt="X" className="size-8" />
          </button>
          <button onClick={() => handleShare("whatsapp")} className="hover:scale-110 transition">
            <img src="/whats.png" alt="WhatsApp" className="size-8" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProduct;

// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Check, Copy, Share2 } from "lucide-react";
// import { useState } from "react";

// type ShareProductProps = {
//   productId: string;
//   className?: string;
// };

// const ShareProduct = ({ productId, ...props }: ShareProductProps) => {
//   const [copied, setCopied] = useState(false);

//   const productUrl = `https://yourdomain.com/product/${productId}`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(productUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleShare = (platform: "facebook" | "x" | "whatsapp") => {
//     let shareUrl = "";
//     if (platform === "facebook") {
//       shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
//     } else if (platform === "x") {
//       shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}`;
//     } else if (platform === "whatsapp") {
//       shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(productUrl)}`;
//     }
//     window.open(shareUrl, "_blank");
//   };

//   return (
//     <Dialog>
//
//       </DialogTrigger>
//       <DialogContent className="!max-w-[400px] flex flex-col items-center space-y-3 py-6">
//         {/* Copy URL */}
//         <div className="w-full flex items-center gap-2 bg-[#F5F5F5] border-0 px-3 py-2 mt-8">
//           <button onClick={handleCopy} className="relative flex items-center justify-center text-gray-500 hover:text-gray-800 transition">
//             {copied ? <Check className="size-5 text-green-600 transition-transform duration-300 scale-110" /> : <Copy className="size-5 text-[#569DD1]" />}
//           </button>
//           <input type="text" readOnly value={productUrl} className="flex-1  outline-none text-[#569DD1]" />
//         </div>

//         {/* Copy feedback message */}
//         <div
//           className={`absolute top-5 right-1/2 translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md transition-opacity duration-300 ${
//             copied ? "opacity-100" : "opacity-0 pointer-events-none"
//           }`}
//         >
//           Link copied
//         </div>

//         {/* Social Share */}
//         <div className="flex justify-center items-center gap-6">
//           <button onClick={() => handleShare("facebook")} className="hover:scale-110 transition">
//             <img src="/facebook.png" alt="Facebook" className="size-8" />
//           </button>
//           <button onClick={() => handleShare("x")} className="hover:scale-110 transition">
//             <img src="/twitter.png" alt="X" className="size-8" />
//           </button>
//           <button onClick={() => handleShare("whatsapp")} className="hover:scale-110 transition">
//             <img src="/whats.png" alt="WhatsApp" className="size-8" />
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ShareProduct;
