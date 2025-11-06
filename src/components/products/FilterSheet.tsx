import FiltersSection from "@/components/products/FiltersSection";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { CategoryRoot } from "@/types/categories";
import { ListFilter } from "lucide-react";

interface FilterSheetProps {
  categories: CategoryRoot[];
  isLoading: boolean;
}

export function FilterSheet({ categories, isLoading }: FilterSheetProps) {
  return (
    <div className="px-10 py-6 ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full !px-3 bg-white hover:bg-primary hover:text-white transition-all duration-300">
            <ListFilter className="h-4 w-4 " /> Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-h-[calc(100vh)] overflow-y-scroll scrollbar">
          <FiltersSection categories={categories} isLoading={isLoading} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
