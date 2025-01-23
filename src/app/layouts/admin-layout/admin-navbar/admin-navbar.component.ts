import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#core/services/auth.service';
import { NotificationService } from '#shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.sass'
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  currentPageTitle = 'Dashboard';
  currentYear = new Date().getFullYear();
  notifications: any[] = [];
  @Output() toggleSidenav = new EventEmitter<void>();
  private notificationSub?: Subscription;
  unreadCount = 0;


  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.notificationSub = this.notificationService.notifications$.subscribe(
      notification => {
        if (notification) {
          this.notifications.unshift(notification);
          this.unreadCount++;
        }
      }
    );
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'order_status': return 'local_shipping';
      case 'new_order': return 'shopping_cart';
      case 'payment_status': return 'payment';
      case 'inventory_alert': return 'inventory';
      default: return 'notifications';
    }
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    });
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

}