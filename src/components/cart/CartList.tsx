import CartItem from "./CartItem";

interface CartItem {
  id: number;
  title: string;
  color: string;
  delivery: string;
  price: number;
  qty: number;
  image: string;
}

interface CartListProps {
  cart: CartItem[];
  onRemoveItem: (id: number) => void;
  onAddQuantity: (id: number) => void;
  onRemoveQuantity: (id: number) => void;
}

export default function CartList({ cart, onRemoveItem, onAddQuantity, onRemoveQuantity }: CartListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="font-bold text-2xl p-4 pb-0">Cart</h2>
        <div className="text-primary">{cart.length} items</div>
      </div>
      {cart.map((item) => (
        <CartItem key={item.id} item={item} onRemove={onRemoveItem} onAddQuantity={onAddQuantity} onRemoveQuantity={onRemoveQuantity} />
      ))}
    </div>
  );
}
