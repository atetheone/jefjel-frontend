import { Role, RoleResponse } from './role'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  tenantId: number
  status: string
  lastLoginAt?: string | null
  roles: Role[]
}

export interface UserResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  tenantId?: number
  createdAt: string
  updatedAt: string
  lastLoginAt?: string | null
  roles: RoleResponse[]
}