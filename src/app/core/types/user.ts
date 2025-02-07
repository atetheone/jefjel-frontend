import { Role, RoleResponse } from './role'

export interface UserProfile {
  id: number;
  userId: number;
  bio?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  profile?: UserProfile;
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
  status?: string
  profile?: UserProfile
}