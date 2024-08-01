import {
  Button,
  ButtonProps,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import { ReactNode } from "react"

interface Props {
  textHeader: string
  body: string | ReactNode
  btnAcceptProps: ButtonProps
  onClose: () => void
}

export default function DialogModal({
  textHeader,
  body,
  btnAcceptProps,
  onClose,
}: Props) {
  return (
    <>
      <ModalHeader>
        <span className="text-2xl">{textHeader}</span>
      </ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button type="submit" color="danger" {...btnAcceptProps}></Button>
      </ModalFooter>
    </>
  )
}
