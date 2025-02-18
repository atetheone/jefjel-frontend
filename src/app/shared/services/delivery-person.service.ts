import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { DeliveryPersonResponse, UpdateZonesRequest } from '#types/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonService {
  private baseUrl = `${environment.apiUrl}/delivery-persons`;

  constructor(private http: HttpClient) {}

  createDeliveryPerson(data: DeliveryPersonResponse): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.post<ApiResponse<DeliveryPersonResponse>>(this.baseUrl, data);
  }

  updateZones(id: number, data: UpdateZonesRequest): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/${id}/zones`, data);
  }

  updateMyZones(data: UpdateZonesRequest): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/my-zones`, data);
  }

  toggleAvailability(isAvailable: boolean): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/availability`, { isAvailable });
  }

  getProfile(): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.get<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/profile`);
  }

  getDeliveryPerson(id: number): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.get<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/${id}`);
  }

  listDeliveryPersons(zoneId?: number): Observable<ApiResponse<DeliveryPersonResponse[]>> {
    const params = zoneId ? { zoneId } : {};
    return this.http.get<ApiResponse<DeliveryPersonResponse[]>>(`${this.baseUrl}?zoneId=${zoneId}`);
  }
}