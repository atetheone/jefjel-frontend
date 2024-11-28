import { ApiResponse } from './api_response';
import { User } from './user';

export interface LoginResponseData {
  user: User
  token: string
}


export type LoginResponse = ApiResponse<LoginResponseData>;