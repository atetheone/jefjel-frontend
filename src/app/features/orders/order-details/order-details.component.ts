// order-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderResponse } from '#types/order';
import { OrderService } from '#shared/services/order.service';
import { ToastService } from '#shared/services/toast.service';
import { NotificationService } from '#shared/services/notification.service';
import { Observable, Subject, switchMap, takeUntil, filter } from 'rxjs';
import { NotificationResponse } from '#core/types/notification';

interface OrderStatusNotification extends NotificationResponse {
  data: {
    orderId: number;
    status: string;
    previousStatus?: string;
  };
}

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.sass'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  order$!: Observable<OrderResponse>;
  isProcessing = false;
  orderId!: number;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private notificationService: NotificationService
  ) {
    this.initializeOrder();
  }

  private initializeOrder() {
    this.order$ = this.route.params.pipe(
      switchMap(params => {
        this.orderId = +params['id'];
        this.setupNotificationListener();
        return this.orderService.getOrder(this.orderId);
      })
    );
  }

  ngOnInit(): void {}

  updateOrderStatus(orderId: number, status: string) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.orderService.updateOrderStatus(orderId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Order status updated successfully');
          this.refreshOrder();
        },
        error: (error) => {
          console.error('Failed to update order status:', error);
          this.toastService.error('Failed to update order status');
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
  }

  private refreshOrder() {
    this.order$ = this.orderService.getOrder(this.orderId);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warn';
      case 'processing':
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warn';
    }
  }

  private setupNotificationListener() {
    this.notificationService.notifications$
      .pipe(
        takeUntil(this.destroy$),
        filter((notification): notification is OrderStatusNotification => 
          notification !== null &&
          notification.type === 'order:status_updated' && 
          notification?.data?.orderId === this.orderId
        )
      )
      .subscribe(notification => {
        this.refreshOrder();
        const statusMessage = notification.data['previousStatus'] 
          ? `from ${notification.data['previousStatus']} to ${notification.data['status']}`
          : `to ${notification.data['status']}`;
          
        this.toastService.info(
          `Order status changed ${statusMessage}`,
          'Order Status Updated'
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}