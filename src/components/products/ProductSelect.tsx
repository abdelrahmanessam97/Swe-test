"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
  price: number;
}

interface ProductSelectProps {
  selectedLength: string | null;
  setSelectedLength: (val: string) => void;
  lengthOptions: Option[];
  selectedVoltage: string | null;
  setSelectedVoltage: (val: string) => void;
  voltageOptions: Option[];
}

export default function ProductSelect({ selectedLength, setSelectedLength, lengthOptions, selectedVoltage, setSelectedVoltage, voltageOptions }: ProductSelectProps) {
  return (
    <div className="space-y-6">
      {/* Length Selection */}
      <div className="space-y-3">
        <h3 className="font-medium text-[#7A7A7A]">Length :</h3>
        <Select value={selectedLength || ""} onValueChange={(val) => setSelectedLength(val)}>
          <SelectTrigger className="w-full">
            <SelectValue className="!text-[#535353]" placeholder="Select Length" />
          </SelectTrigger>
          <SelectContent>
            {lengthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="!text-[#535353] cursor-pointer w-full">
                <div className="flex gap-x-10 w-full">
                  <span>{option.label}</span>
                  {option.price > 0 && <span className="text-sm text-gray-500">+{option.price} L.E</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voltage Selection */}
      <div className="space-y-3">
        <h3 className="font-medium text-[#7A7A7A]">Voltage :</h3>
        <Select value={selectedVoltage || ""} onValueChange={(val) => setSelectedVoltage(val)}>
          <SelectTrigger className="w-full">
            <SelectValue className="!text-[#535353]" placeholder="Select Voltage" />
          </SelectTrigger>
          <SelectContent>
            {voltageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="!text-[#535353] cursor-pointer w-full">
                <div className="flex gap-x-10 w-full">
                  <span>{option.label}</span>
                  {option.price > 0 && <span className="text-sm text-gray-500">+{option.price} L.E</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
