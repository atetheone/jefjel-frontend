import { User } from './user';
import { ApiResponse } from './api_response';
import { Role } from './role';

export interface UserData {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  tenantId: number
  createdAt: string
  updatedAt: string
  roles: Role[]
}

export type UserRegistrationResponse = ApiResponse<UserData>;