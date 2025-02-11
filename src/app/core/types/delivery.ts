
export interface DeliveryResponse {
  id: number;
  orderId: number;
  status: 'pending' | 'assigned' | 'picked' | 'delivered' | 'returned' | 'cancelled';
  notes?: string;
  assignedAt: string;
  pickedAt?: string;
  deliveredAt?: string;
  order: {
    id: number;
    total: number;
    shippingAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      phone?: string;
    };
  };
}