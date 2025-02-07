import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { NotificationService } from '#shared/services/notification.service';
import { NotificationResponse } from '#core/types/notification';
import { NotificationIconPipe } from '#shared/pipes/notification-icon.pipe';

@Component({
  selector: 'app-notification-details',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NotificationIconPipe
  ],
  template: `
    <div class="container mx-auto p-4">
      @if (loading) {
        <div class="flex justify-center p-8">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (!notification) {
        <mat-card>
          <mat-card-content class="text-center py-8">
            <mat-icon class="text-4xl text-gray-400 mb-2">
              error_outline
            </mat-icon>
            <p class="text-gray-500">Notification not found</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-header class="bg-gray-50 p-4">
            <mat-icon mat-card-avatar>
              {{ notification.type | notificationIcon }}
            </mat-icon>
            <mat-card-title>{{ notification.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ notification.createdAt | date:'medium' }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="p-4">
            <p class="text-lg">{{ notification.message }}</p>

            @if (notification.data) {
              <div class="mt-6">
                <h3 class="text-lg font-medium mb-2">Additional Information</h3>
                <pre class="bg-gray-50 p-4 rounded overflow-auto">
                  {{ notification.data | json }}
                </pre>
              </div>
            }
          </mat-card-content>

          <mat-card-actions class="p-4 flex justify-between">
            <button mat-stroked-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back to Notifications
            </button>
            <div class="space-x-2">
              <button mat-stroked-button color="warn" 
                      (click)="deleteNotification(notification.id)">
                Delete
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    :host
      display: block
    
    pre 
      max-height: 400px
  `]
})
export class NotificationDetailsComponent implements OnInit {
  notification?: NotificationResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.notificationService.getNotificationById(+id).subscribe({
        next: (response) => {
          this.notification = response;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }


  deleteNotification(id: number) {
    // this.notificationService.deleteNotification(id).subscribe(() => {
    //   this.goBack();
    // });
  }

  goBack() {
    this.router.navigate(['/dashboard/notifications']);
  }
}