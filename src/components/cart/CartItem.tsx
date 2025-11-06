import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CartItemProps {
  item: {
    id: number;
    title: string;
    color: string;
    delivery: string;
    price: number;
    qty: number;
    image: string;
  };
  onRemove: (id: number) => void;
  onAddQuantity: (id: number) => void;
  onRemoveQuantity: (id: number) => void;
}

export default function CartItem({ item, onRemove, onAddQuantity, onRemoveQuantity }: CartItemProps) {
  return (
    <div className="p-4 flex items-start justify-between not-last:border-b">
      <div className="flex gap-4 items-center">
        <img src={item.image} alt={item.title} className="w-[143px] h-[132px] rounded" />
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">
            Color:
            <span
              className="inline-block w-3 h-3 mx-1 rounded-full"
              style={{
                backgroundColor: item.color.toLocaleLowerCase(),
              }}
            ></span>
            {item.color}
          </p>
          <p className="text-sm text-primary">Delivery {item.delivery}</p>
          <div className="flex items-center bg-gray-100 gap-2 w-fit">
            <button type="button" className="text-gray-500 hover:text-primary p-2" onClick={() => onRemoveQuantity(item.id)}>
              <Minus size={18} />
            </button>
            <span>{item.qty}</span>
            <button type="button" className="text-gray-500 hover:text-primary p-3" onClick={() => onAddQuantity(item.id)}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <p className="font-semibold">{item.price} </p>
        <Button variant="link" className="text-gray-500 hover:text-primary inline-block" size="sm" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </div>
    </div>
  );
}
