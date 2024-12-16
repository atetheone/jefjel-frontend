import { ApiResponse } from './api_response';
import { UserResponse } from './user';

export interface LoginResponseData {
  user: UserResponse
  token: string
}


export type LoginResponse = ApiResponse<LoginResponseData>;