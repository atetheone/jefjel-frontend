import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { OrderService } from '#shared/services/order.service';
import { OrderResponse } from '#types/order';
import { BehaviorSubject } from 'rxjs';
import { DataState } from '#types/data_state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tenant-orders',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './tenant-orders.component.html',
  styleUrl: './tenant-orders.component.sass'
})
export class TenantOrdersComponent {
  private ordersSubject = new BehaviorSubject<DataState<OrderResponse[]>>({
    status: 'loading',
    error: null
  });
  orders$ = this.ordersSubject.asObservable();
  dataSource = new MatTableDataSource<OrderResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = [
    'orderId',
    'user',
    'date',
    'total',
    'status',
    'actions'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.orders$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  loadOrders() {
    this.ordersSubject.next({ status: 'loading', error: null });
    
    this.orderService.getTenantOrders().subscribe({
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
          error: 'Failed to load orders'
        });
      }
    });
  }

  getOrderStatus(status: string): string {
    return {
      'pending': 'warn',
      'processing': 'primary',
      'shipped': 'accent',
      'delivered': 'primary',
      'cancelled': 'warn'
    }[status] || 'default';
  }
}
