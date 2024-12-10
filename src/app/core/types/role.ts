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

export interface RoleRequest {
  id: number
  name: string
  tenantId?: number
  permissionIds: number[]
}

export interface UpdateRoleRequest extends RoleRequest {

}

export interface CreateRoleRequest extends RoleRequest {

}