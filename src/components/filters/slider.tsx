import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps<T> extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  filterKey: keyof T; // Use keyof T to ensure filterKey is a key of the generic filter structure
  defaultValue: number[];
  min: number;
  max: number;
  step: number;
  filter: T; // Use generic type T for the filter
  setFilter: React.Dispatch<React.SetStateAction<T>>; // Use generic type T for setFilter's parameter
}

export default function Slider<T>({
  filterKey,
  defaultValue,
  min,
  max,
  step,
  filter,
  setFilter
}: SliderProps<T>) {

  return (
    <SliderPrimitive.Root
      className="relative flex w-full touch-none select-none items-center"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onValueChange={(value) => setFilter({...filter, [filterKey]: value[0]})}    
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  )
}