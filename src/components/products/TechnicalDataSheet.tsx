import { useProductsStore } from "@/stores/productsStore";
import { ArrowDownToLine, Info, Loader2 } from "lucide-react";

interface TechnicalDataSheetProps {
  productId: number;
}

const TechnicalDataSheet = ({ productId }: TechnicalDataSheetProps) => {
  const { downloadTechnicalDataSheet, isDownloading, hasDownloadSheet } = useProductsStore();

  const handleDownload = async () => {
    await downloadTechnicalDataSheet(productId);
  };

  if (!hasDownloadSheet) return null;

  return (
    <div className="block w-fit mt-15">
      <div className="flex items-center justify-between rounded-md gap-16 w-full bg-[#F0F0F0] text-[#505050] px-4 py-3">
        <button onClick={handleDownload} disabled={isDownloading} className="flex items-center gap-2 cursor-pointer disabled:opacity-50">
          {isDownloading ? <Loader2 color="#569DD1" width={18} height={18} className="animate-spin" /> : <ArrowDownToLine color="#569DD1" width={18} height={18} />}
          <p className="text-[#505050] font-medium">{isDownloading ? "Downloading..." : "Technical Data Sheet"}</p>
        </button>
        <Info color="#7D7D7D" width={18} height={18} />
      </div>
    </div>
  );
};

export default TechnicalDataSheet;
