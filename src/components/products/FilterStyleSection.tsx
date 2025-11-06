import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  styles: string[];
  selectedStyles: string[];
  toggleStyle: (style: string) => void;
};

export function FilterStyleSection({ styles, selectedStyles, toggleStyle }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium mb-3 text-[#505050]">Style</h3>
      {styles.map((style, indx) => {
        const id = `style-${indx}-${style.replace(/\s+/g, "-")}`;
        return (
          <div key={style} className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={selectedStyles.includes(style)}
              onCheckedChange={() => toggleStyle(style)}
              className="data-[state=checked]:bg-[#C21D0B] data-[state=checked]:border-[#C21D0B] data-[state=checked]:text-white"
            />
            <Label htmlFor={id}>{style}</Label>
          </div>
        );
      })}
    </div>
  );
}
