import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationResponse } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/notifications';

  getForRecipient(recipientId: string): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.baseUrl, {
      params: { recipientId }
    });
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
}
