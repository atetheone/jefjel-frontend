import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationService } from '#shared/services/notification.service';
import { NotificationResponse } from '#core/types/notification';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { NotificationIconPipe } from '#shared/pipes/notification-icon.pipe';

@Component({
  selector: 'app-notifications-list',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NotificationIconPipe
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Notifications</h1>
        @if (unreadCount > 0) {
          <button mat-flat-button color="primary" (click)="markAllAsRead()">
            Mark all as read
          </button>
        }
      </div>

      @if (loading) {
        <div class="flex justify-center p-8">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (!notifications.length) {
        <mat-card>
          <mat-card-content class="text-center py-8">
            <mat-icon class="text-4xl text-gray-400 mb-2">
              notifications_off
            </mat-icon>
            <p class="text-gray-500">No notifications to display</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="grid gap-4">
          @for (notification of notifications; track notification.id) {
            <mat-card 
              [class.bg-gray-50]="!notification.isRead"
              class="cursor-pointer transition-all hover:shadow-md"
              (click)="openNotification(notification.id)">
              <mat-card-content class="p-4">
                <div class="flex items-start gap-4">
                  <mat-icon [color]="notification.isRead ? '' : 'primary'">
                    {{ notification.type | notificationIcon }}
                  </mat-icon>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <h3 class="font-medium" [class.font-bold]="!notification.isRead">
                        {{ notification.title }}
                      </h3>
                      <small class="text-gray-500">
                        {{ notification.createdAt | date:'MMM d, y, h:mm a' }}
                      </small>
                    </div>
                    <p class="text-gray-600 mt-1">{{ notification.message }}</p>
                  </div>
                  <button mat-icon-button (click)="deleteNotification(notification.id, $event)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host 
      display: block
    
  `]
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  notifications: NotificationResponse[] = [];
  unreadCount = 0;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.notificationsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.loading = false;
      });

    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications().subscribe();
  }

  openNotification(id: number) {
    if (true) {
      this.notificationService.markAsRead(id)
        .pipe(
          switchMap(() => {
            // Navigate to notification details
            return this.router.navigate(['/dashboard/notifications', id]);
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Error processing notification:', error);
          }
        });
    } else {
      // If already read, just navigate to details
      this.router.navigate(['/dashboard/notifications', id]);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  deleteNotification(id: number, event: Event) {
    // event.stopPropagation();
    // this.notificationService.deleteNotification(id).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}