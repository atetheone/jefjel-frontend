import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { AddressResponse } from '#types/address'; // AddressService
import { OrderResponse, CreateOrderRequest } from '#types/order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<ApiResponse<OrderResponse>>(this.baseUrl, orderData)
      .pipe(map(response => response.data));
  }

  loadUserAddresses(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/addresses`)
      .pipe(map(response => response.data));
  }

  getDefaultShippingAddress(): Observable<AddressResponse> {
    return this.http.get<ApiResponse<AddressResponse>>(`${environment.apiUrl}/addresses/default/shipping`)
      .pipe(map(response => response.data));
  }
}
