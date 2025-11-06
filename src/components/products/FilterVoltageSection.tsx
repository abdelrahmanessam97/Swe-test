import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  voltages: string[];
  selectedVoltages: string[];
  toggleVoltage: (voltage: string) => void;
};

const FilterVoltageSection = ({ voltages, selectedVoltages, toggleVoltage }: Props) => {
  return (
    <div>
      <h3 className="font-medium mb-3 text-[#505050]">Voltage</h3>
      <div className="flex flex-col gap-3">
        {voltages.map((voltage, indx) => {
          const id = `voltage-${indx}-${voltage.replace(/\s+/g, "-")}`;
          return (
            <div key={voltage} className="flex items-center gap-3">
              <Checkbox
                id={id}
                checked={selectedVoltages.includes(voltage)}
                onCheckedChange={() => toggleVoltage(voltage)}
                className="data-[state=checked]:bg-[#C21D0B] data-[state=checked]:border-[#C21D0B] data-[state=checked]:text-white"
              />
              <Label htmlFor={id}>{voltage}</Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterVoltageSection;
