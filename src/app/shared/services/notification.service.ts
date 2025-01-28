import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, io } from 'socket.io-client';
import { environment } from '#env/environment';
import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';
import { Subject, Observable, BehaviorSubject, tap, takeUntil } from 'rxjs';
import { ApiResponse } from '#core/types/api_response';
import { NotificationResponse, NotificationCount } from '#core/types/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/notifications`;
  private socket!: Socket;
  private destroy$ = new Subject<void>();

  private notificationsSubject = new BehaviorSubject<NotificationResponse | null>(null);
  private notificationsListSubject = new BehaviorSubject<NotificationResponse[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  notifications$ = this.notificationsSubject.asObservable();
  notificationsList$ = this.notificationsListSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private http: HttpClient
  ) {
    this.initializeSocket();
    this.setupAuthListener();
    this.loadInitialData();
  }

  private initializeSocket() {
    this.socket = io(environment.wsUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: this.authService.getToken()
      }
    });

    this.setupSocketListeners();
  }

  private setupAuthListener() {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.loadInitialData();
        } else {
          this.notificationsSubject.next(null);
          this.notificationsListSubject.next([]);
          this.unreadCountSubject.next(0);
        }
      });
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('notification', (notification: NotificationResponse) => {
      // Update notifications
      const currentList = this.notificationsListSubject.value;
      this.notificationsListSubject.next([notification, ...currentList]);
      this.notificationsSubject.next(notification);
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);

      // Show toast based on type
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
        default:
          this.toastService.success(notification.message, notification.title);
      }
    });
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}