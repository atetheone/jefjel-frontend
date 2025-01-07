export interface InventorySettings {
  reorderPoint: number
  reorderQuantity: number
  lowStockThreshold: number
}

export interface UpdateInventoryDto {
  stock?: number
  settings?: InventorySettings
}

export interface InventoryResponse {
  id: number
  productId: number
  tenantId: number
  quantity: number
  reorderPoint: number
  reorderQuantity: number
  lowStockThreshold: number
  createdAt?: string
  updatedAt?: string
}
