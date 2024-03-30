import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

interface SliderProps {
  defaultValue: number[];
  min: number;
  max: number;
  filter: {
    min_price: number;
    max_price: number;
    min_remaining_lease: number;
    region: string;
    flat_type: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    min_price: number;
    max_price: number;
    min_remaining_lease: number;
    region: string;
    flat_type: string;
  }>>;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({filter, setFilter, min, max, defaultValue}: SliderProps, ref) => {  
  return(
    <SliderPrimitive.Root
      ref={ref}
      className="relative flex w-full touch-none select-none items-center"
      min={min}
      max={max}
      defaultValue={defaultValue}
      onValueChange={(e) => setFilter({...filter, min_remaining_lease: e[0]})}    
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
)})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
