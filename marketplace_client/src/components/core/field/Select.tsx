import {
  Select as NextSelect,
  SelectProps as NextSelectProps,
  SelectItem,
} from "@nextui-org/react"

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends Omit<NextSelectProps, "children"> {
  t: "select"
  options: SelectOption[]
}

export default function Select({ t, options, ...props }: SelectProps) {
  if (t !== "select") return <></>

  return (
    <NextSelect {...props}>
      {options.map(({ label, value }) => (
        <SelectItem value={value} key={value}>
          {label}
        </SelectItem>
      ))}
    </NextSelect>
  )
}
