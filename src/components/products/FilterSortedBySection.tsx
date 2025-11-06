// FilterSortedBySection.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  sortedBy: string[];
  selectedSortedBy: string | null;
  onChange: (sort: string) => void;
};

const FilterSortedBySection = ({ sortedBy, selectedSortedBy, onChange }: Props) => {
  return (
    <div>
      <h3 className="font-medium mb-3 text-lg text-[#000000]">Sorted by</h3>
      <RadioGroup value={selectedSortedBy ?? ""} onValueChange={(val) => onChange(val)} className="flex flex-col gap-3">
        {sortedBy.map((sort, indx) => {
          const id = `sort-${indx}-${sort.replace(/\s+/g, "-")}`;
          return (
            <div key={sort} className="flex items-center gap-3 w-full border text-[#333333] border-[#EEEEEE] rounded-md p-3">
              <RadioGroupItem id={id} value={sort} className="text-primary  data-[state=checked]:border-primary" />
              <Label htmlFor={id}>{sort}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default FilterSortedBySection;
