import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { User } from "types/user"

export interface RechargeRequest {
  money: number
}
export interface RechargeResponse extends User {}

export async function recharge(data: RechargeRequest) {
  return (await api.patch<RechargeResponse>("/user/recharge", data)).data
}

export function useRecharge() {
  return useMutation({
    mutationFn: recharge,
  })
}
