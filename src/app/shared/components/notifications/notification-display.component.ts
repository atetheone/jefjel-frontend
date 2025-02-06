import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationService } from '#shared/services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationIconPipe } from '#pipes/notification-icon.pipe';

@Component({
  selector: 'app-notification-display',
  standalone: true,
  imports: [CommonModule, MaterialModule, NotificationIconPipe],
  template: `
    <div class="fixed top-4 right-4 z-50">
      @for (notification of activeNotifications; track notification.id) {
        <div class="notification-toast mb-2" [@slideIn]>
          <mat-card>
            <mat-card-content class="flex items-start p-3">
              <mat-icon [color]="getIconColor(notification.type)" class="mr-3">
                {{ notification.type | notificationIcon }}
              </mat-icon>
              <div class="flex-1">
                <div class="font-medium">{{ notification.title }}</div>
                <div class="text-sm text-gray-600">{{ notification.message }}</div>
              </div>
              <button mat-icon-button (click)="removeNotification(notification.id)">
                <mat-icon>close</mat-icon>
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-toast
      max-width: 400px
      min-width: 300px
  
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationDisplayComponent implements OnInit, OnDestroy {
  activeNotifications: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        if (notification) {
          this.showNotification(notification);
        }
      });
  }

  private showNotification(notification: any) {
    this.activeNotifications.unshift(notification);
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: number) {
    this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);
  }

  getIconColor(type: string): string {
    if (type.includes('error') || type.includes('failed')) return 'warn';
    if (type.includes('success') || type.includes('created')) return 'primary';
    return '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}