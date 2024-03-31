import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const amenities = {
  'None': '',
  'Bus Stops': 'bus',
  'Hawker Centres': 'hawker',
  'Malls': 'mall',
  'MRT/LRT': 'mrtlrt',
  'Parks': 'park',
  'Schools': 'school',
  'Supermarkets': 'supermarket',
}

export default function SelectAmenity({setSelectedAmenity}: {setSelectedAmenity: (e: string) => void}) {
  return (
    <RadioGroup defaultValue="" onValueChange={(e) => setSelectedAmenity(e)}>
      {Object.keys(amenities).map((key) => (
        <div className="flex items-center space-x-2" key={key}>
          <RadioGroupItem value={amenities[key]} id={key} />
          <Label htmlFor={key}>{key}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}