export interface InventorySettings {
  reorderPoint: number
  reorderQuantity: number
  lowStockThreshold: number
}

export interface UpdateInventoryDto {
  stock?: number
  settings?: InventorySettings
  reservedQuantity?: number
}

export interface InventoryResponse {
  id: number
  productId: number
  tenantId: number
  quantity: number
  reservedQuantity?: number
  reorderPoint: number
  reorderQuantity: number
  lowStockThreshold: number
  createdAt?: string
  updatedAt?: string
}
