import { Spinner } from "@nextui-org/react"
import clsx from "clsx"

interface LoadingIconProps {
  size?: "sm" | "md" | "lg" | "xl"
}

export default function LoadingIcon({ size = "md" }: LoadingIconProps) {
  return (
    <Spinner
      className="h-full w-full"
      classNames={{
        wrapper: clsx({
          "w-5 h-5": size === "sm",
          "w-8 h-8": size === "md",
          "w-10 h-10": size === "lg",
          "w-16 h-16": size === "xl",
        }),
        circle1: clsx({ "border-2": size === "sm", "border-4": size === "xl" }),
        circle2: clsx({ "border-2": size === "sm", "border-4": size === "xl" }),
      }}
    />
  )
}
