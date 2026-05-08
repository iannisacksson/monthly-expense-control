export interface CreateExpenseItemDTO {
  description: string
  amount: number
}

export interface UpdateExpenseItemDTO {
  description?: string
  amount?: number
}