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

export interface PermissionGroup {
  resource: string;
  actions: {
    id: number;
    action: string;
    selected: boolean;
  }[];
}

