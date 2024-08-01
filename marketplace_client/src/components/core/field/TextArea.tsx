import {
  Textarea as NextTextArea,
  TextAreaProps as NextTextAreaProps,
} from "@nextui-org/react"
import { ForwardedRef, forwardRef } from "react"

export interface TextAreaProps extends NextTextAreaProps {
  t: "text-area"
}

const TextArea = forwardRef(
  ({ t, ...props }: TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    if (t === "text-area")
      return (
        <NextTextArea
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

export default TextArea
