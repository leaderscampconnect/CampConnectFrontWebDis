import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NotificationApiService } from '../services/notification-api.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  notificationApi = inject(NotificationApiService);
  router = inject(Router);

  unreadCount = signal(0);
  private pollingSub?: Subscription;

  ngOnInit() {
    this.pollingSub = timer(0, 30000).pipe(
      filter(() => this.auth.authenticated() && !!this.auth.userId()),
      switchMap(() => this.notificationApi.getUnreadCount(this.auth.userId()!))
    ).subscribe({
      next: (res) => this.unreadCount.set(res.unreadCount),
      error: (err) => console.error('Failed to poll unread count', err)
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
