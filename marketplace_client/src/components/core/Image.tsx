import {
  HTMLMotionProps,
  motion,
  useAnimationControls,
  useInView,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Image(props: HTMLMotionProps<"img">) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
      once: true,
    }),
    controls = useAnimationControls()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    if (status === "loaded")
      controls.start({
        opacity: 1,
      })
  }, [status, controls])

  return (
    <div className="inline-flex justify-center items-center" ref={ref}>
      {isInView && (
        <motion.img
          {...props}
          initial={{
            opacity: 0,
          }}
          animate={controls}
          onLoad={() => setStatus("loaded")}
        />
      )}
    </div>
  )
}
