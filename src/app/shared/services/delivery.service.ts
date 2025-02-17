import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { DeliveryResponse, DeliveryPersonResponse, AssignDeliveryRequest } from '#types/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  assignDelivery(data: AssignDeliveryRequest): Observable<ApiResponse<DeliveryResponse>> {
    return this.http.post<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/assign`, data);
  }

  updateDeliveryStatus(deliveryId: number, status: string, notes?: string): Observable<ApiResponse<DeliveryResponse>> {
    return this.http.patch<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/${deliveryId}/status`, { status, notes });
  }

  getDeliveryDetails(id: number): Observable<ApiResponse<DeliveryResponse>> {
    return this.http.get<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/${id}`);
  }

  getAvailableDeliveryPersons(zoneId: number): Observable<ApiResponse<DeliveryPersonResponse[]>> {
    return this.http.get<ApiResponse<DeliveryPersonResponse[]>>(`${this.baseUrl}/available-persons/${zoneId}`);
  }

  getMyDeliveries(status?: string): Observable<ApiResponse<DeliveryResponse[]>> {
    const params = status ? { status } : {};
    return this.http.get<ApiResponse<DeliveryResponse[]>>(`${this.baseUrl}/my-deliveries`, { params });
  }
}
