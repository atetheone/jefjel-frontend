export interface Permission {
  resource: string
  action: string
}

export interface PermissionResponse {
  id: number
  resource: string
  action: string
  tenantId?: number
  createdAt?: string
  updatedAt?: string
}
