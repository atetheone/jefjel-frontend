import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationService } from '#shared/services/notification.service';
import { NotificationListComponent } from './notification-list.component';
import { Subject, takeUntil } from 'rxjs';
import { NotificationResponse } from '#core/types/notification';

@Component({
  selector: 'app-notifications-menu',
  imports: [CommonModule, MaterialModule, RouterModule, NotificationListComponent],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationsMenu">
      <mat-icon [matBadge]="unreadCount" 
                [matBadgeHidden]="unreadCount === 0" 
                matBadgeColor="warn">
        notifications
      </mat-icon>
    </button>

    <mat-menu #notificationsMenu="matMenu" class="notification-menu">
      <div class="p-2 flex justify-between items-center border-b">
        <span class="font-semibold">Notifications</span>
        <div class="flex items-center gap-2">
          <button mat-button 
              color="primary" 
              routerLink="/dashboard/notifications"
              matMenuClose>
            View All
          </button>
          @if (unreadCount > 0) {
            <button mat-button 
                color="primary" 
                (click)="markAllAsRead()">
              Mark all as read
            </button>
          }
        </div>
      </div>

      <app-notification-list
        [notifications]="notifications"
        (onMarkAsRead)="markAsRead($event)">
      </app-notification-list>
    </mat-menu>
  `,
  styles: [`
    :host
      display: inline-block
    
  `]
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {
  notifications: NotificationResponse[] = [];
  unreadCount = 0;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notificationsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    this.notificationService.getNotifications().subscribe();
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}