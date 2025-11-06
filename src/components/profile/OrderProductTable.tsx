import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderDetails } from "@/types/orders";
import WriteReview from "./WriteReview";

const OrderProductTable = ({ details }: { details: OrderDetails }) => {
  // prices in details already formatted as strings

  if (!details || !details.items || details.items.length === 0) {
    return <div className="p-4">No products for this order</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader className="bg-muted">
          <TableRow className="border-none">
            <TableHead className="text-left w-[50%]">PRODUCT</TableHead>
            <TableHead className="text-left w-[15%]">PRICE</TableHead>
            <TableHead className="text-center w-[15%]">QUANTITY</TableHead>
            <TableHead className="text-right w-[20%]">SUBTOTAL</TableHead>
            {/complete|delivered/i.test(details.order_status || "") && <TableHead className="text-right w-[10%]"></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {details.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex items-center gap-3">
                {details.show_product_thumbnail !== false && (
                  <img src={item.picture?.image_url || ""} alt="product" width={50} height={50} className="rounded-sm object-cover" />
                )}
                <span className="font-medium whitespace-nowrap">{item.product_name}</span>
              </TableCell>

              <TableCell className="text-left whitespace-nowrap">{item.unit_price}</TableCell>

              <TableCell className="text-center">{item.quantity}</TableCell>

              <TableCell className="text-right whitespace-nowrap">{item.sub_total}</TableCell>

              {/complete|delivered/i.test(details.order_status || "") && (
                <TableCell className="text-right">
                  <WriteReview />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderProductTable;
