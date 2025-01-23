import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, io } from 'socket.io-client';
import { environment } from '#env/environment';
import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';
import { Subject, Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  observable!: Observable<string>;
  private socket!: Socket;
  private notificationsSubject = new BehaviorSubject<any>(null)
  notifications$ = this.notificationsSubject.asObservable()

  orderUpdates$ = new Subject<{orderId: number, status: string, message: string}>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private http: HttpClient
  ) {

    this.initSocket()

    this.setupSocketConnection();

    // this.setupListeners();
  }

  initSocket() {
    this.socket = io(`${environment.wsUrl}`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.authService.user$.subscribe(user => {
      if (user) {
        this.socket.emit('join:marketplace', user.id)
      }
    })

    this.socket.on('notification', (notification) => {
      this.notificationsSubject.next(notification)
      console.log('Notification received')
      this.toastService.success(notification?.message)
    })
  }
  // setupListeners() {
  //   this.socket.on('order:status_updated', (data) => {
  //     this.orderUpdates$.next(data);
  //     this.toastService.success(data.message);
  //   });
  // }

  sayHello(): Observable<any> {
    this.socket.emit('msgFromFE', { message: 'Hello from Frontend!' });
    
    return new Observable(observer => {
      this.socket.on('msgFromBE', (data) => {
        console.log('Received from BE:', data);
        observer.next(data);
      });

      return () => this.socket.off('msgFromBE');
    });
  }

  private setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.toastService.success('Connected to notification service');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.toastService.error('Failed to connect to notification service');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        // Update local notification state
        const currentNotifications = this.notificationsSubject.value;
        if (currentNotifications) {
          const updatedNotifications = currentNotifications.map((n: any) => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          this.notificationsSubject.next(updatedNotifications);
        }
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        // Update local notification state
        const currentNotifications = this.notificationsSubject.value;
        if (currentNotifications) {
          const updatedNotifications = currentNotifications.map((n: any) => 
            ({ ...n, isRead: true })
          );
          this.notificationsSubject.next(updatedNotifications);
        }
      })
    );
  }

}
