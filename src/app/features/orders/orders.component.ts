import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OrderResponse } from '#types/order';
import { OrderService } from '#shared/services/order.service';
import { ToastService } from '#shared/services/toast.service';
import { DataState } from '#types/data_state';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {
  private ordersSubject = new BehaviorSubject<DataState<OrderResponse[]>>({
    status: 'loading',
    data: [],
    error: null
  });
  orders$ = this.ordersSubject.asObservable();
  isProcessing = false;

  displayedColumns = [
    'orderId',
    'date',
    'items',
    'total',
    'status',
    'actions'
  ];

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  confirmOrder(order: OrderResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Order',
        message: `Are you sure you want to confirm order #${order.id}?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateOrderStatus(order.id, 'processing');
      }
    });
  }

  cancelOrder(order: OrderResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Order',
        message: `Are you sure you want to cancel order #${order.id}?`,
        confirmText: 'Cancel Order',
        cancelText: 'Keep Order'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateOrderStatus(order.id, 'cancelled');
      }
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  private updateOrderStatus(orderId: number, status: string) {
    this.isProcessing = true;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastService.success(`Order ${status === 'cancelled' ? 'cancelled' : 'confirmed'} successfully`);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order:', error);
        this.toastService.error(`Failed to ${status} order`);
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  loadOrders() {
    this.ordersSubject.next({ status: 'loading', data: [], error: null });
    
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.ordersSubject.next({
          status: 'success',
          data: orders,
          error: null
        });
      },
      error: (error) => {
        this.ordersSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load orders'
        });
      }
    });
  }

  getOrderStatus(status: string) {
    return {
      pending: 'primary',
      processing: 'accent',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'warn'
    }[status] || 'default';
  }
}