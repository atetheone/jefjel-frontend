import { ProductResponse } from './product'

export interface CartResponse {
  id: number;
  userId: number;
  tenantId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  product: ProductResponse,
  quantity: number;
  options?: any;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}