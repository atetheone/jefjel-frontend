import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { AddressResponse } from '#types/address'; // AddressService
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addresseApiUrl = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) {}

  loadUserAddresses(): Observable<AddressResponse[]> {
    return this.http.get<ApiResponse<AddressResponse[]>>(`${this.addresseApiUrl}`)
      .pipe(map(response => response.data));
  }

  getDefaultShippingAddress(): Observable<AddressResponse> {
    return this.http.get<ApiResponse<AddressResponse>>(`${this.addresseApiUrl}/default/shipping`)
      .pipe(map(response => response.data));
  }
}
