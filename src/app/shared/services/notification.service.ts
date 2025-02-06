import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { AuthService } from '#services/auth.service';
import { SocketService } from '#services/socket.service';
import { ToastService } from '#shared/services/toast.service';
import { Subject, Observable, BehaviorSubject, tap, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators'
import { ApiResponse } from '#core/types/api_response';
import { NotificationResponse, NotificationCount } from '#core/types/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  private destroy$ = new Subject<void>();

  private notificationsSubject = new BehaviorSubject<NotificationResponse | null>(null);
  private notificationsListSubject = new BehaviorSubject<NotificationResponse[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  notifications$ = this.notificationsSubject.asObservable();
  notificationsList$ = this.notificationsListSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private toastService: ToastService,
    private http: HttpClient
  ) {
    this.setupAuthListener();
    this.setupSocketListener();
  }

  private setupAuthListener() {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.loadInitialData();
        } else {
          this.resetState();
        }
      });
  }

  private setupSocketListener() {
    this.socketService.on<NotificationResponse>('notification', (notification) => {
      this.handleNewNotification(notification);
    });
  }

  private handleNewNotification(notification: NotificationResponse) {
    // Update notifications
    const currentList = this.notificationsListSubject.value;
    this.notificationsListSubject.next([notification, ...currentList]);
    this.notificationsSubject.next(notification);
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
  
    // Show toast notification
    this.showNotificationToast(notification);
  }
  
  private showNotificationToast(notification: NotificationResponse) {
    switch (notification.type) {
      case 'inventory:low':
        this.toastService.warning(notification.message, notification.title);
        break;
      case 'order:status_updated':
        this.toastService.info(notification.message, notification.title);
        break;
      case 'order:cancelled':
        this.toastService.error(notification.message, notification.title);
        break;
      case 'payment:failed':
        this.toastService.error(notification.message, notification.title);
        break;
      case 'user:registered':
      case 'order:created':
        this.toastService.success(notification.message, notification.title);
        break;
      default:
        this.toastService.info(notification.message, notification.title);
    }
  }

  private resetState() {
    this.notificationsSubject.next(null);
    this.notificationsListSubject.next([]);
    this.unreadCountSubject.next(0);
  }

  private loadInitialData() {
    this.getNotifications().subscribe();
    this.getUnreadCount().subscribe();
  }


  getNotifications(type?: string): Observable<ApiResponse<NotificationResponse[]>> {    
    return this.http.get<ApiResponse<NotificationResponse[]>>(this.apiUrl, {
      params: type ? { type } : {}
    }).pipe(
      tap(response => {
        if (response.success) {
          this.notificationsListSubject.next(response.data);
        }
      })
    );
  }

  getUnreadCount(): Observable<ApiResponse<NotificationCount>> {
    return this.http.get<ApiResponse<NotificationCount>>(`${this.apiUrl}/unread`).pipe(
      tap(response => {
        if (response.success) {
          this.unreadCountSubject.next(response.data.count);
        }
      })
    );
  }

  markAsRead(notificationId: number): Observable<ApiResponse<NotificationResponse>> {
    return this.http.patch<ApiResponse<NotificationResponse>>(
      `${this.apiUrl}/${notificationId}/read`, 
      {}
    ).pipe(
      tap(response => {
        if (response.success) {
          const currentList = this.notificationsListSubject.value;
          const updated = currentList.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          this.notificationsListSubject.next(updated);
          this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
        }
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse<{ affected: number }>> {
    return this.http.patch<ApiResponse<{ affected: number }>>(
      `${this.apiUrl}/read-all`,
      {}
    ).pipe(
      tap(response => {
        if (response.success) {
          const currentList = this.notificationsListSubject.value;
          const updated = currentList.map(n => ({ ...n, isRead: true }));
          this.notificationsListSubject.next(updated);
          this.unreadCountSubject.next(0);
        }
      })
    );
  }

  getNotificationById(id: number): Observable<NotificationResponse> {
    return this.http.get<ApiResponse<NotificationResponse>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}