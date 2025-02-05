import { Routes } from '@angular/router'
import { authGuard } from '#guards/auth.guard'

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./notifications-list.component')
            .then(m => m.NotificationsListComponent),
        data: { breadcrumb: 'Notifications' }
      },
      {
        path: ':id',
        loadComponent: () => 
          import('./notification-details.component')
            .then(m => m.NotificationDetailsComponent),
        data: { breadcrumb: 'Notification Details' }
      }
    ]
  }
]