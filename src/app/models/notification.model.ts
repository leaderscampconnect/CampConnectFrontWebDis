export interface NotificationResponse {
  id: string;
  recipientId: string;
  eventId: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  actionUrl: string | null;
}

export const NOTIFICATION_TYPES = [
  'EVENT_CREATED',
  'REGISTRATION_CONFIRMED',
  'WAITLIST_JOINED',
  'WAITLIST_PROMOTED',
  'REGISTRATION_CANCELLED',
  'EVENT_POSTPONED',
  'EVENT_CANCELLED',
  'EVENT_STARTED',
  'EVENT_COMPLETED',
  'EVENT_REMINDER',
  'USER_WELCOME',
  'USER_PROFILE_UPDATED',
  'USER_PASSWORD_RESET',
  'GENERAL'
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export interface NotificationRequest {
  recipientId: string;
  eventId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
}

export interface NotificationFilters {
  recipientId?: string;
  eventId?: string;
  read?: boolean;
  type?: NotificationType;
}
