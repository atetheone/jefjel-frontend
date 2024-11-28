import { Permission, PermissionResponse } from './permission'

export interface Role {
  name: string
  permissions: Permission[]
}


export interface RoleResponse {
  id: number
  name: string
  tenantId?: number
  createdAt?: string
  updatedAt?: string
  permissions: PermissionResponse[]
}