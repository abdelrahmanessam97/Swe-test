import { getTrackBackground, Range } from "react-range";
interface props {
  values: number[];
  setValues: (values: number[]) => void;
  MIN: number;
  MAX: number;
  STEP: number;
}
const FilterPriceSection = ({ values, setValues, MIN, MAX, STEP }: props) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-3 text-[#505050]">Price</h3>

      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(vals) => setValues(vals)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full rounded"
            style={{
              ...props.style,
              background: getTrackBackground({
                values: values,

                colors: ["#F0F0F0", "#C21D0B", "#F0F0F0"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => <div {...props} key={index} className="w-3 h-3 bg-[#C21D0B] rounded-full shadow" />}
      />

      <div className="flex justify-between text-xs mt-2">
        <span>{values[0]} L.E</span>
        <span>{values[1]} L.E</span>
      </div>
    </div>
  );
};

export default FilterPriceSection;
