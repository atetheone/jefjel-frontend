import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MaterialModule } from '#shared/material/material.module'
// import { CurrencyPipe } from '@angular/common'

interface DashboardStats {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  dashboardStats: DashboardStats[] = [
    {
      title: 'Total Sales',
      value: '$45,231',
      change: 12.5,
      icon: 'attach_money',
      color: '#2196F3'
    },
    {
      title: 'Orders',
      value: '2,321',
      change: 8.3,
      icon: 'shopping_cart',
      color: '#4CAF50'
    },
    {
      title: 'Customers',
      value: '1,456',
      change: 15.7,
      icon: 'people',
      color: '#9C27B0'
    },
    {
      title: 'Products',
      value: '453',
      change: 6.2,
      icon: 'inventory',
      color: '#FF9800'
    }
  ];
}
