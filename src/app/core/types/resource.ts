export interface ResourceResponse {
  id: number
  name: string
  description: string
  isActive: boolean
  availableActions: string[]
  tenantId?: number
}

export interface CreateResourceDto {
  name: string
  description: string
  availableActions: string[]
  tenantId?: number
}

export interface UpdateResourceDto {
  description?: string
  availableActions?: string[]
  isActive?: boolean
}
