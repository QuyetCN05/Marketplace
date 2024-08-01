import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"
import { useUser } from "store/user"
import { useRecharge } from "../services/recharge"

interface Props {
  onClose: () => void
}

export default function RechargeModal({ onClose }: Props) {
  const { setUser } = useUser()

  const [money, setMoney] = useState(0)

  const recharge = useRecharge()

  const handleRecharge = (money: number) => {
    recharge.mutate(
      { money },
      {
        onSuccess: (data) => {
          setUser(data)
          toast.success("Recharge successfully")
          onClose()
        },
      },
    )
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Add funds to the wallet
      </ModalHeader>
      <ModalBody>
        <Input
          size="lg"
          type="number"
          variant="bordered"
          color="secondary"
          onValueChange={(value) => setMoney(Number(value))}
          startContent={
            <Icon icon="material-symbols:wallet" className="text-xl" />
          }
          endContent={<Icon icon="healthicons:dollar" className="text-xl" />}
          placeholder="Enter deposit amount"
          autoFocus
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
          Close
        </Button>
        <Button
          color="secondary"
          onPress={() => {
            handleRecharge(money)
          }}
          isLoading={recharge.isPending}
        >
          Submit
        </Button>
      </ModalFooter>
    </>
  )
}
