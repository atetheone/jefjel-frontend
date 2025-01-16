import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OrderResponse } from '#types/order';
import { OrderService } from '#shared/services/order.service';
import { DataState } from '#types/data_state';

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

  displayedColumns = [
    'orderId',
    'date',
    'items',
    'total',
    'status',
    'actions'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
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