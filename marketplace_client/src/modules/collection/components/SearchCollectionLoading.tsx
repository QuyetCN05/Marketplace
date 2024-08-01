import { Button, Skeleton } from "@nextui-org/react"
import { cn } from "utils/cn"

interface Props {
  wrapperClass?: string
  quality?: number
}

export default function SearchCollectionLoading({
  quality = 5,
  wrapperClass,
}: Props) {
  return (
    <div className={cn(["flex flex-col gap-5", wrapperClass])}>
      {Array(quality)
        .fill("")
        .map((_, idx) => (
          <Button
            key={idx}
            variant="flat"
            color="default"
            fullWidth
            className="flex h-fit justify-between gap-5 px-4 py-4 capitalize"
          >
            <div className="flex w-full items-center gap-3">
              <div>
                <Skeleton className="flex h-12 w-12 rounded-full" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </div>
            </div>
          </Button>
        ))}
    </div>
  )
}
