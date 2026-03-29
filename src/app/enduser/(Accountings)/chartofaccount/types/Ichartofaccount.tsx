export type IChart = {
  id: string
  name: string
  balance: number
  balanceType: string
  ledgerGroupResponses: ILedgerGroupResponse[]
}

export type ILedgerGroupResponse = {
  id: string
  name: string
  balance: number
  balanceType: string
  SubLedgerGroupResponses: ISubLedgerGroupResponse[]
}
export type ISubLedgerGroupResponse = {
  id: string
  name: string
  balance: number
  balanceType: string
  ledgerResponses: ILedgerResponse[]
}
export type ILedgerResponse = {
  id: string
  name: string
  balance: number
  balanceType: string
}
