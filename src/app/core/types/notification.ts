export interface NotificationResponse {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any
  isRead: boolean;
  userId: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCount {
  count: number;
}