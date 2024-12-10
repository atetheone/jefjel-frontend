export interface Tenant {
  name: string
  slug: string
  domain: string
  description?: string
  isActive?: string
}

export interface TenantResponse extends Tenant {
  id: string
}

export interface CreateTenantRequest extends Tenant {}

export interface UpdateTenantRequest extends TenantResponse {}