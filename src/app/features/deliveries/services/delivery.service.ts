import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryResponse } from '#types/delivery';
import { DeliveryZoneResponse } from '#types/zone';



@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  getMyZones(): Observable<DeliveryZoneResponse[]> {
    return this.http.get<ApiResponse<DeliveryZoneResponse[]>>(`${this.apiUrl}/zones/my`)
      .pipe(map(response => response.data));
  }

  updateMyZones(zoneIds: number[]): Observable<DeliveryZoneResponse[]> {
    return this.http.put<ApiResponse<DeliveryZoneResponse[]>>(`${this.apiUrl}/zones/my`, { zoneIds })
      .pipe(map(response => response.data));
  }

  getMyDeliveries(status?: string): Observable<DeliveryResponse[]> {
    const params = status ? { status } : {};
    return this.http.get<ApiResponse<DeliveryResponse[]>>(`${this.apiUrl}/my-orders`, { params })
      .pipe(map(response => response.data));
  }

  updateDeliveryStatus(deliveryId: number, status: string, notes?: string): Observable<DeliveryResponse> {
    return this.http.patch<ApiResponse<DeliveryResponse>>(`${this.apiUrl}/${deliveryId}/status`, { status, notes })
      .pipe(map(response => response.data));
  }
}
