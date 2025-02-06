import React from "react";
import {Slider} from "@heroui/react";

interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  maxValue: number;
  minValue?: number;
  step: number;
  label: string;
  formatOptions?: Intl.NumberFormatOptions;
}

export function RangeSlider({ 
  value, 
  onChange, 
  maxValue, 
  minValue = 0, 
  step, 
  label,
  formatOptions = {style: "currency", currency: "USD"}
}: RangeSliderProps) {
  const formatValue = (val: number) => {
    if (formatOptions.style === 'percent') {
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(val / 100);
    }
    return val.toLocaleString(undefined, formatOptions);
  };
//   console.log(formatValue(value[0]));
//   console.log(formatValue(value[1]));
  console.log(value[0]);
  console.log(value[1]);

  return (
    <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
      <Slider
        className="max-w-md"
        // formatOptions={formatOptions}
        label={label}
        maxValue={maxValue}
        minValue={minValue}
        step={step}
        value={value}
        onChange={(value) => onChange(value as [number, number])}
      />
      <p className="text-default-500 font-medium text-small">
        Selected range: {value[0]} – {value[1]}
      </p>
    </div>
  );
}

// For backward compatibility
export const AmountSlider = RangeSlider;

