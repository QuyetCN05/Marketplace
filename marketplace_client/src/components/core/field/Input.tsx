import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react"
import { ForwardedRef, forwardRef } from "react"

export interface InputProps extends NextInputProps {
  t: "input" | "hide-input-errors"
}

const Input = forwardRef(
  ({ t, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    if (t === "hide-input-errors" || t === "input")
      return (
        <NextInput
          ref={ref}
          color="secondary"
          classNames={{ label: "text-black" }}
          variant="bordered"
          {...props}
        />
      )

    return <></>
  },
)

export default Input
