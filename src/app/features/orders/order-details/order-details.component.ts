import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderResponse } from '#types/order';
import { OrderService } from '#shared/services/order.service';
import { ToastService } from '#shared/services/toast.service';
import { NotificationService } from '#shared/services/notification.service'
import { Observable, switchMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.sass'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  notificationSubscription: Subscription | null = null
  order$: Observable<OrderResponse>;
  isProcessing = false;
  orderId!: number;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private notificationService: NotificationService
  ) {
    this.order$ = this.route.params.pipe(
      switchMap(params => {
        this.orderId = params['id'];
        this.setupNotificationListener()
        return this.orderService.getOrder(this.orderId)
      })
    );

  }

  ngOnInit(): void {
    this.notificationService.sayHello().subscribe({
      next: (data) => console.log('Hello response:', data),
      error: (error) => console.error('Socket error:', error)
    });
  }

  updateOrderStatus(orderId: number, status: string) {
    this.isProcessing = true;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastService.success('Order status updated successfully');
        this.refreshOrder(orderId);
      },
      error: () => {
        console.error('Failed to update order status');
        this.toastService.error('Failed to update order status');
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  private refreshOrder(orderId: number) {
    this.order$ = this.orderService.getOrder(orderId);
  }

  getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'pending': return 'warn';
      case 'processing': return 'primary';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'warn';
    }
  }

  setupNotificationListener() {
    this.notificationSubscription = this.notificationService.notifications$
    .subscribe(notification => {
      if (notification?.type === 'order_status' && notification.data.orderId === this.orderId) {
        this.updateOrderStatus(notification.data, notification.data.status)
      }
    })
  }

  ngOnDestroy() {
    this.notificationSubscription?.unsubscribe()
  }
}
