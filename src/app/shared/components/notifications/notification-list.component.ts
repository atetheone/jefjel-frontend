import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationResponse } from '#core/types/notification';
import { NotificationItemComponent } from './notification-item.component';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, MaterialModule, NotificationItemComponent],
  template: `
    <div class="notification-list">
      @if (notifications.length === 0) {
        <div class="p-4 text-center text-gray-500">
          <mat-icon class="mb-2">notifications_off</mat-icon>
          <p>No notifications</p>
        </div>
      } @else {
        <div class="max-h-96 overflow-y-auto">
          @for (notification of notifications; track notification.id) {
            <app-notification-item
              [notification]="notification"
              (markAsRead)="onMarkAsRead.emit($event)">
            </app-notification-item>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-list 
      min-width: 320px
      max-width: 400px
  `]
})
export class NotificationListComponent {
  @Input() notifications: NotificationResponse[] = [];
  @Output() onMarkAsRead = new EventEmitter<number>();
}