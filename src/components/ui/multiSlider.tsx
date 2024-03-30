// slider.tsx
'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface MultiSliderProps {
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

const MultiSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({filter, setFilter, defaultValue, min, max}: MultiSliderProps, ref) => {
  return(
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center')}
    defaultValue={defaultValue}
    min={min}
    max={max}
    onValueChange={(e) => setFilter({...filter, min_price: e[0], max_price: e[1]})}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
)});
MultiSlider.displayName = SliderPrimitive.Root.displayName;

export { MultiSlider };