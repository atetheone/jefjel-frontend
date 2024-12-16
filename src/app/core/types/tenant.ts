export interface Tenant {
  name: string
  slug: string
  domain: string
  description?: string
  isActive?: boolean
  status?: string
}

export interface TenantResponse extends Tenant {
  id: number
  createdAt?: string
  updatedAt?: string
}


export interface CreateTenantRequest extends Tenant {}

export interface UpdateTenantRequest extends TenantResponse {}

export interface TenantDetails extends TenantResponse {}
