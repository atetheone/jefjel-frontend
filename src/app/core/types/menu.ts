import { ApiResponse } from './api_response';

export interface MenuItem {
  id: number;
  label: string;
  icon: string;
  route: string;
  order?: number;
  requiredPermissions?: string[];
  children?: MenuItem[];
  createdAt?: string;
  updatedAt?: string;
}


export type MenuResponse = ApiResponse<MenuItem[]>;
