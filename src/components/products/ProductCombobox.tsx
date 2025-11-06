import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
  price: number;
}

interface ProductComboboxProps {
  selectedLength: string | null;
  setSelectedLength: (val: string) => void;
  lengthOptions: Option[];
  selectedVoltage: string | null;
  setSelectedVoltage: (val: string) => void;
  voltageOptions: Option[];
}

export default function ProductCombobox({ selectedLength, setSelectedLength, lengthOptions, selectedVoltage, setSelectedVoltage, voltageOptions }: ProductComboboxProps) {
  const [openLength, setOpenLength] = useState(false);
  const [openVoltage, setOpenVoltage] = useState(false);

  const handleLengthSelect = (value: string) => {
    setSelectedLength(value);
    setOpenLength(false);
  };

  const handleVoltageSelect = (value: string) => {
    setSelectedVoltage(value);
    setOpenVoltage(false);
  };

  return (
    <div className="space-y-6">
      {/* Length */}
      <div className="space-y-3">
        <h3 className="font-medium text-[#7A7A7A]">Length :</h3>
        <Popover open={openLength} onOpenChange={setOpenLength}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openLength} className="w-full justify-between">
              {selectedLength ? lengthOptions.find((l) => l.value === selectedLength)?.label : "Choose Length"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 z-50 w-[250px]">
            <Command>
              <CommandInput placeholder="Search length..." />
              <CommandList>
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {lengthOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleLengthSelect(option.value)}
                      onClick={() => handleLengthSelect(option.value)}
                      className="flex items-center justify-between w-full cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {option.price > 0 && <span className="text-sm text-gray-500">+{option.price} L.E</span>}
                      {selectedLength === option.value && <Check className="ml-2 h-4 w-4 opacity-100" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Voltage */}
      <div className="space-y-3">
        <h3 className="font-medium text-[#7A7A7A]">Voltage :</h3>
        <Popover open={openVoltage} onOpenChange={setOpenVoltage}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openVoltage} className="w-full justify-between">
              {selectedVoltage ? voltageOptions.find((v) => v.value === selectedVoltage)?.label : "Choose Voltage"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0 z-50 w-[250px]">
            <Command>
              <CommandInput placeholder="Search voltage..." />
              <CommandList>
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {voltageOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleVoltageSelect(option.value)}
                      onClick={() => handleVoltageSelect(option.value)}
                      className="flex items-center justify-between w-full cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {option.price > 0 && <span className="text-sm text-gray-500">+{option.price} L.E</span>}
                      {selectedVoltage === option.value && <Check className="ml-2 h-4 w-4 opacity-100" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
