import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { OrderResponse, CreateOrderRequest } from '#types/order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<ApiResponse<OrderResponse>>(this.baseUrl, orderData)
      .pipe(map(response => response.data));
  }

  getUserOrders(): Observable<OrderResponse[]> {

    return this.http.get<ApiResponse<OrderResponse[]>>(`${this.baseUrl}`)
      .pipe(map((response: ApiResponse<OrderResponse[]>) => response.data));
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<ApiResponse<OrderResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.patch<ApiResponse<OrderResponse>>(`${this.baseUrl}/${orderId}/status`, { status })
      .pipe(map(response => response.data));
  }
}
