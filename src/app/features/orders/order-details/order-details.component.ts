import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderResponse } from '#types/order';
import { OrderService } from '#shared/services/order.service';
import { ToastService } from '#app/shared/services/toast.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.sass'
})
export class OrderDetailsComponent implements OnInit {
  order$: Observable<OrderResponse>;
  isProcessing = false;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.order$ = this.route.params.pipe(
      switchMap(params => this.orderService.getOrder(params['id']))
    );
  }

  ngOnInit(): void {
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
}
