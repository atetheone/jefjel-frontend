import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationResponse } from '#core/types/notification';
import { NotificationIconPipe } from '#pipes/notification-icon.pipe';

@Component({
  selector: 'app-notification-item',
  imports: [
    CommonModule,
    MaterialModule,
    NotificationIconPipe
  ],
  template: `
    <button mat-menu-item 
            [class.bg-gray-50]="!notification.isRead"
            (click)="markAsRead.emit(notification.id)">
      <mat-icon [color]="notification.isRead ? '' : 'primary'">
        {{ notification.type | notificationIcon }}
      </mat-icon>
      <div class="flex flex-col ml-2">
        <span class="text-sm font-medium">{{ notification.title }}</span>
        <small class="text-gray-500 text-xs">{{ notification.message }}</small>
        <small class="text-gray-400 text-xs mt-1">
          {{ notification.createdAt | date:'short' }}
        </small>
      </div>
    </button>
  `,
  styles: [`
    :host
      display: block
    
  `]
})
export class NotificationItemComponent {
  @Input({ required: true }) notification!: NotificationResponse;
  @Output() markAsRead = new EventEmitter<number>();
}