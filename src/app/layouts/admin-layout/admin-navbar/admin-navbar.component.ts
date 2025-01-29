import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#core/services/auth.service';
import { NotificationService } from '#shared/services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationResponse } from '#core/types/notification';

@Component({
  selector: 'app-admin-navbar',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.sass'
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  currentPageTitle = 'Dashboard';
  currentYear = new Date().getFullYear();
  notifications: NotificationResponse[] = [];
  unreadCount = 0;
  @Output() toggleSidenav = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Subscribe to notifications list
    this.notificationService.notificationsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Subscribe to unread count
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    // Load initial notifications
    this.notificationService.getNotifications().subscribe();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'order:status_updated':
      case 'order:created': 
        return 'local_shipping';
      case 'order:cancelled': 
        return 'cancel';
      case 'inventory:low': 
        return 'inventory_2';
      case 'inventory:reorder': 
        return 'shopping_cart';
      default: 
        return 'notifications';
    }
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}