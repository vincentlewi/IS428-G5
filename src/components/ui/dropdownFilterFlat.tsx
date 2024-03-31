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
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function DropdownFilterFlat({filterKey, placeholder, items, filter, setFilter}: DropdownFilterProps) {
  return (
    <Select onValueChange={(value) => setFilter(value)}>
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
