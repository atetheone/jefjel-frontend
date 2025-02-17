import { UserResponse } from './user'
import { ApiResponse } from './api_response'
import { DeliveryZoneResponse } from './zone'
import { OrderResponse } from './order'

export interface Delivery {
  id: number
  orderId: number
  deliveryPersonId: number
  notes?: string
  status: 'pending' | 'assigned' | 'picked' | 'delivered' | 'returned' | 'cancelled'
  assignedAt?: string
  pickedAt?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryPerson {
  id: number
  userId: number
  tenantId: number
  isActive: boolean
  isAvailable: boolean
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van'
  vehiclePlateNumber: string
  vehicleModel?: string
  vehicleYear?: number
  licenseNumber: string
  licenseExpiry: string
  licenseType?: string
  totalDeliveries: number
  completedDeliveries: number
  returnedDeliveries: number
  averageDeliveryTime?: number
  rating?: number
  totalReviews: number
  lastActiveAt?: string
  lastDeliveryAt?: string
  verifiedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AssignDeliveryRequest {
  orderId: number
  deliveryPersonId: number
}

export interface UpdateDeliveryStatusRequest {
  status: 'delivered' | 'cancelled' | 'picked' | 'returned'
  notes?: string
}

export interface UpdateZonesRequest {
  zoneIds: number[]
}

export interface UpdateAvailabilityRequest {
  isAvailable: boolean
}

export interface DeliveryPersonResponse extends DeliveryPerson {
  user: UserResponse
  zones: DeliveryZoneResponse[]
}

export interface DeliveryResponse extends Delivery {
  order: OrderResponse
  deliveryPerson: DeliveryPersonResponse
}

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED = 'picked',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  CAR = 'car',
  VAN = 'van'
}
