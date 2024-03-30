import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DropdownFilterProps {
  filterKey: string;
  placeholder: string;
  items: string[];
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

export function DropdownFilter({filterKey, placeholder, items, filter, setFilter}: DropdownFilterProps) {
  return (
    <Select onValueChange={(value) => setFilter({...filter, [filterKey]: value})}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
