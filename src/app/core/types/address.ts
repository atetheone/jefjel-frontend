export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phone?: string;
  isDefault: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  type: 'shipping' | 'billing';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
}

export type AddressResponse = Address;
