export interface BaseZoneDto {
  name: string
  fee: number
}

export interface CreateZoneDto extends BaseZoneDto {}

export interface UpdateZoneDto extends BaseZoneDto {
  id: number
}

export interface DeliveryZoneResponse extends BaseZoneDto {
  id: number
  tenantId: number
  createdAt: string
  updatedAt: string
} 
