const FilterColorSection = ({ colors, selectedColor, setSelectedColor }: { colors: string[]; selectedColor: string; setSelectedColor: (color: string) => void }) => {
  return (
    <div>
      <h3 className="font-medium mb-3 text-[#505050]">Colors</h3>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full border-2 border-white  transition-all  ${
              selectedColor === color ? "outline-1 outline-gray-600 scale-110" : " hover:border-gray-400"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterColorSection;
