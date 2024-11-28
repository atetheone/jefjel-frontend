import { Component } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module'
import { CurrencyPipe } from '@angular/common'

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  dashboardData = {
    orders: 150,
    revenue: 25000,
    users: 45,
    recentOrders: [
      {
        orderId: '#001',
        customer: 'John Doe',
        amount: 299.99,
      },
      {
        orderId: '#002',
        customer: 'Jane Smith',
        amount: 199.50,
      },
      {
        orderId: '#003',
        customer: 'Bob Johnson',
        amount: 499.99,
      },
    ]
  }
}
