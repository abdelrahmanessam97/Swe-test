// import { Checkbox } from "@/components/ui/checkbox";
// import { useProductsStore } from "@/stores/productsStore";
// import type { ProductDetails } from "@/types/products";
// import { showToast } from "@/utils/toast";
// import { useState } from "react";

// export interface CompareProduct {
//   id: number;
//   title: string;
//   description: string;
//   price: string;
//   image: string;
// }

// interface CompareProductSelectionProps {
//   products: CompareProduct[];
//   onCompare: (selectedProductIds: number[]) => void;
//   onSkip?: () => void;
// }

// const CompareProductSelection = ({ products, onCompare, onSkip }: CompareProductSelectionProps) => {
//   const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const { fetchProductDetails } = useProductsStore();

//   const handleToggleProduct = (productId: number) => {
//     setSelectedProducts((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
//   };

//   const handleCompare = async () => {
//     if (selectedProducts.length === 0) return;

//     setLoading(true);

//     try {
//       // Fetch product details for each selected product sequentially
//       // Since fetchProductDetails updates a single state in the store,
//       // we need to fetch them one by one and store each result
//       const fetchedDetails: ProductDetails[] = [];

//       for (const productId of selectedProducts) {
//         await fetchProductDetails(productId);
//         // Get the current product details from store after each fetch
//         const currentDetails = useProductsStore.getState().productDetails;
//         if (currentDetails) {
//           fetchedDetails.push(currentDetails);
//         }
//       }

//       setLoading(false);

//       // Call onCompare callback with selected IDs and fetched details
//       onCompare(selectedProducts);
//     } catch (error) {
//       setLoading(false);
//       showToast("Failed to fetch product details for comparison", "error");
//       console.error("Error fetching product details:", error);
//     }
//   };

//   const handleSkip = () => {
//     if (onSkip) {
//       onSkip();
//     }
//     setSelectedProducts([]);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Products</h1>
//         <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet conse bolli tetur. Lorem ipsum dolor sit amet</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 overflow-y-auto flex-1 scrollbar shadow-sm rounded-sm bg-white p-4">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="flex items-center gap-3 py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
//             onClick={() => handleToggleProduct(product.id)}
//           >
//             <div className="flex-shrink-0">
//               <Checkbox
//                 checked={selectedProducts.includes(product.id)}
//                 onCheckedChange={() => handleToggleProduct(product.id)}
//                 onClick={(e) => e.stopPropagation()}
//                 className="rounded"
//               />
//             </div>
//             <img
//               src={product.image}
//               alt={product.title}
//               className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src = "/placeholder.webp";
//               }}
//             />
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{product.title}</h3>
//               <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">{product.description}</p>
//               <p className="text-sm font-semibold text-gray-900">{product.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex flex-col gap-2 mt-4 pt-4">
//         <button
//           onClick={handleCompare}
//           disabled={selectedProducts.length === 0 || loading}
//           className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Loading..." : "Compare"}
//         </button>

//         {onSkip && (
//           <button onClick={handleSkip} className="w-full text-center text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors py-1">
//             Skip
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompareProductSelection;
