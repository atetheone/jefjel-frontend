import { Injectable, OnDestroy } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '#env/environment';
import { AuthService } from '#services/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private destroy$ = new Subject<void>();
  private connectionStatus = new BehaviorSubject<boolean>(false);

  connectionStatus$ = this.connectionStatus.asObservable();

  constructor(private authService: AuthService) {
    this.setupAuthListener();
  }

  private setupAuthListener() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  private connect() {
    if (this.socket?.connected) return;

    const token = this.authService.getToken();

    if (!token) {
      console.warn('Missing auth token');
      return;
    }

    this.socket = io(environment.wsUrl, {
      transports: ['websocket', 'polling'],
      auth: {  
        token: `Bearer ${token}`
      },
      withCredentials: true
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connectionStatus.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connectionStatus.next(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connectionStatus.next(false);
    });
  }

  public on<T>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  public emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus.next(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}