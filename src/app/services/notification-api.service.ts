import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  NotificationFilters,
  NotificationRequest,
  NotificationResponse
} from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/notifications';

  getNotifications(filters: NotificationFilters = {}): Observable<NotificationResponse[]> {
    const params: Record<string, string> = {};
    if (filters.recipientId) params['recipientId'] = filters.recipientId;
    if (filters.eventId) params['eventId'] = filters.eventId;
    if (filters.read !== undefined) params['read'] = String(filters.read);
    if (filters.type) params['type'] = filters.type;
    return this.http.get<NotificationResponse[]>(this.baseUrl, { params });
  }

  getForRecipient(recipientId: string): Observable<NotificationResponse[]> {
    return this.getNotifications({ recipientId });
  }

  getNotification(id: string): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.baseUrl}/${id}`);
  }

  createNotification(request: NotificationRequest): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(this.baseUrl, request);
  }

  updateNotification(
    id: string,
    request: NotificationRequest
  ): Observable<NotificationResponse> {
    return this.http.put<NotificationResponse>(`${this.baseUrl}/${id}`, request);
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  markAsRead(id: string): Observable<NotificationResponse> {
    return this.http.patch<NotificationResponse>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(recipientId: string): Observable<{ updatedCount: number }> {
    return this.http.patch<{ updatedCount: number }>(
      `${this.baseUrl}/recipient/${recipientId}/read-all`,
      {}
    );
  }

  getUnreadCount(recipientId: string): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(
      `${this.baseUrl}/recipient/${recipientId}/unread-count`
    );
  }

  getCampingNotifications(): Observable<NotificationResponse[]> {
    return this.http.get<{ data: any[] }>('/api/camping-notifications/my-history').pipe(
      map(response => (response.data || []).map(item => ({
        id: item._id || item.id,
        recipientId: item.recipientId,
        eventId: item.eventId,
        type: item.eventType || item.type,
        title: item.subject || item.title,
        message: item.message,
        read: item.read || false,
        readAt: item.readAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        actionUrl: item.actionUrl
      })))
    );
  }
}
