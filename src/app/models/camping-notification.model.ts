export interface CampingNotificationResponse {
  id: string;
  recipientId: string;
  campId: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  actionUrl: string | null;
}

export const CAMPING_NOTIFICATION_TYPES = [
  'BOOKING_CONFIRMED',
  'BOOKING_RECEIVED'
] as const;

export type CampingNotificationType = typeof CAMPING_NOTIFICATION_TYPES[number];

export interface CampingNotificationRequest {
  recipientId: string;
  campId: string | null;
  type: CampingNotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
}

export interface CampingNotificationFilters {
  recipientId?: string;
  campId?: string;
  read?: boolean;
  type?: CampingNotificationType;
}
