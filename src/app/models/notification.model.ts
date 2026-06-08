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
