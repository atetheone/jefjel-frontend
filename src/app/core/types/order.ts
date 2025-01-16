import { Address, AddressRequest } from './address';
import { CartItem } from './cart';
import { UserResponse } from './user';
import { ApiResponse } from './api_response';

export interface Order {
  id: number;
  userId: number;
  tenantId: number;
  addressId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: number;
  paymentMethod: string;
  total: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  user?: UserResponse;
  shippingAddress?: Address;
  items: OrderItem[];
}

export interface OrderItem extends CartItem {
  orderId: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  cartId: number;
  shippingAddress: AddressRequest;
  paymentMethod: string;
}

export type OrderResponse = Order;