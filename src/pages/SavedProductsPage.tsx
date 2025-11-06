import EmptyState from "@/components/empty-state/EmptyState";
import AppDownload from "@/components/home/AppDownload";
import Products from "@/components/home/Products";
import ValuesSections from "@/components/home/ValuesSections";
import MainSection from "@/components/products/MainSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";
import { DialogClose } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

const SavedProductsPage = () => {
  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [isChooseItemsOpen, setIsChooseItemsOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [savedLists, setSavedLists] = useState<{ name: string; items: string[] }[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewListOpen(false);
    setIsChooseItemsOpen(true);
  };

  const handleToggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSaveList = () => {
    const newList = { name: listName, items: selectedItems };
    setSavedLists((prev) => [...prev, newList]);

    // show this list by default
    setSelectedList(listName);

    setIsChooseItemsOpen(false);
    setListName("");
    setSelectedItems([]);
  };

  return (
    <section className="main-p  !pt-0 !pb-0">
      {products.length > 0 ? (
        <>
          <MainSection
            title="SAVED PRODUCTS"
            para="Your favorite items, all in one place. Review, compare, and shop them anytime you're ready."
            imgUrl="/saved-products-bg.png"
          />

          <div className="container main-p">
            <div className="flex gap-4 flex-wrap">
              {savedLists.map((list, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedList(list.name)}
                  className={`px-10 rounded-md hover:bg-[#535353] hover:text-white transition-all duration-300   ${
                    selectedList === list.name ? "bg-[#535353] text-white" : "bg-[#F8F8F8] text-[#3A3A3A]"
                  } `}
                >
                  {list.name}
                </Button>
              ))}

              <Dialog open={isNewListOpen} onOpenChange={setIsNewListOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="">
                    <Plus className="h-4 w-4 text-[#B3B3B3]" /> <span className="text-[#B3B3B3]">New List</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddList}>
                    <DialogHeader className="space-y-1">
                      <DialogTitle>Add New List</DialogTitle>
                      <DialogDescription>Give your list a name to get started.</DialogDescription>
                    </DialogHeader>
                    <div className="grid my-4">
                      <div className="grid gap-2">
                        <Label htmlFor="list-name">List Name</Label>
                        <Input
                          id="list-name"
                          className="focus-visible:ring-0"
                          name="list-name"
                          placeholder="Enter list name"
                          required
                          value={listName}
                          onChange={(e) => setListName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        Add
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isChooseItemsOpen} onOpenChange={setIsChooseItemsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Choose Items to add in this list</DialogTitle>
                    <DialogDescription>Select the products you want to save in your new list.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      {products.slice(0, 8).map((p) => (
                        <div key={p.id} className="p-3 flex items-center gap-2 border rounded-lg">
                          <input
                            type="checkbox"
                            className="accent-[#C21D0B] w-4 h-4 cursor-pointer"
                            id={`prod-${p.id}`}
                            checked={selectedItems.includes(`${p.id}`)}
                            onChange={() => handleToggleItem(`${p.id}`)}
                          />
                          <label htmlFor={`prod-${p.id}`} className="cursor-pointer flex items-center gap-2">
                            <img src={p.image} alt="" className="w-20 h-20 object-cover rounded" />
                            <div>
                              {p.title}
                              <p className="text-sm text-gray-500">{p.price} </p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="grid grid-cols-1">
                    <Button onClick={handleSaveList} className="w-full block">
                      ADD
                    </Button>
                    <DialogClose asChild className="w-full">
                      <Button variant={"link"} className="block">
                        Skip
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {selectedList && (
              <>
                <div className="mt-6">
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {savedLists
                      .find((list) => list.name === selectedList)
                      ?.items.map((id) => {
                        const product = products.find((p) => p.id === parseInt(id));
                        if (!product) return null;
                        return (
                          <div key={id} className="min-w-[200px] border rounded-lg  flex-shrink-0">
                            <img src={product.image} alt="" className="w-full h-32 object-cover rounded" />
                            <div className="p-2">
                              <h4 className="mt-2 text-sm font-medium">{product.title}</h4>
                              <p className="text-gray-600">{product.price} </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <Separator className="my-10" />
              </>
            )}

            <Products title="Saved Items" link="/products" linkText="Find out more" products={products} activeArrow />
            <Products title="Recommended for you" link="/products" linkText="Find out more" products={products} activeArrow />
          </div>
        </>
      ) : (
        <EmptyState
          title="You have no saved items."
          para="Save products and create lists for a faster, easier shopping experience."
          imgUrl="/saved-products-empty-state.png"
        />
      )}
      <div className="my-10"></div>
      <ValuesSections />
      <div className="my-10"></div>
      <AppDownload firstImage="/auth1.png" secondImage="/auth2.png" thirdImage="/auth3.png" />
    </section>
  );
};

export default SavedProductsPage;
