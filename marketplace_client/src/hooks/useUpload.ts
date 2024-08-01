import { useMutation } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { api } from "configs/api"
import { useEffect, useMemo, useState } from "react"
import { Accept, FileRejection, useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

interface UseUploadProps<T> {
  url: string
  accept: Accept
  maxSize: number
  multiple?: boolean
  onSuccess?(data: AxiosResponse<T>): string
}

export default function useUpload<T = unknown>({
  url,
  accept,
  maxSize,
  multiple,
  onSuccess,
}: UseUploadProps<T>) {
  console.log(123)
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => api.post<T>(url, data),
  })
  const [queue, setQueue] = useState<File[]>([])

  const queueFn = useMemo(
    () => ({
      push: (files: File[]) =>
        setQueue((currentQueue) => [...currentQueue, ...files]),
      shift: () =>
        setQueue((currentQueue) => {
          currentQueue.shift()
          return currentQueue
        }),
    }),
    [],
  )
  const mutateUpload = (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    mutate(formData, {
      onSuccess,
    })
  }
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length)
      fileRejections.forEach((file) =>
        file.errors.forEach((err) => {
          if (err.code === "file-invalid-type") toast.error("Invalid file type")
          if (err.code === "file-too-large")
            toast.error(`File too large (>${maxSize}MB)`)
        }),
      )
    if (acceptedFiles.length) queueFn.push(acceptedFiles)
  }
  const { getRootProps } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024,
    multiple,
  })

  useEffect(() => {
    if (!isPending && queue.length) {
      mutateUpload(queue[0])
      queueFn.shift()
    }
  }, [isPending, queue])

  return {
    getRootProps,
    isPending,
    queue,
  }
}
