import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CampingNotificationFilters,
  CampingNotificationRequest,
  CampingNotificationResponse
} from '../models/camping-notification.model';

@Injectable({ providedIn: 'root' })
export class CampingNotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/notifications/v2/camping';

  getNotifications(filters: CampingNotificationFilters = {}): Observable<CampingNotificationResponse[]> {
    const params: Record<string, string> = {};
    if (filters.recipientId) params['recipientId'] = filters.recipientId;
    if (filters.campId) params['campId'] = filters.campId;
    if (filters.read !== undefined) params['read'] = String(filters.read);
    if (filters.type) params['type'] = filters.type;
    return this.http.get<CampingNotificationResponse[]>(this.baseUrl, { params });
  }

  getForRecipient(recipientId: string): Observable<CampingNotificationResponse[]> {
    return this.getNotifications({ recipientId });
  }

  getNotification(id: string): Observable<CampingNotificationResponse> {
    return this.http.get<CampingNotificationResponse>(`${this.baseUrl}/${id}`);
  }

  createNotification(request: CampingNotificationRequest): Observable<CampingNotificationResponse> {
    return this.http.post<CampingNotificationResponse>(this.baseUrl, request);
  }

  updateNotification(
    id: string,
    request: CampingNotificationRequest
  ): Observable<CampingNotificationResponse> {
    return this.http.put<CampingNotificationResponse>(`${this.baseUrl}/${id}`, request);
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  markAsRead(id: string): Observable<CampingNotificationResponse> {
    return this.http.patch<CampingNotificationResponse>(`${this.baseUrl}/${id}/read`, {});
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
}
