import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { AddressRequest, AddressResponse } from '#types/address'; // AddressService
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressApiUrl = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) {}

  loadUserAddresses(): Observable<AddressResponse[]> {
    return this.http.get<ApiResponse<AddressResponse[]>>(`${this.addressApiUrl}`)
      .pipe(map(response => response.data));
  }

  getDefaultShippingAddress(): Observable<AddressResponse> {
    return this.http.get<ApiResponse<AddressResponse>>(`${this.addressApiUrl}/default/shipping`)
      .pipe(map(response => response.data));
  }

  updateAddress(addressId: number, address: AddressRequest): Observable<AddressResponse> {
    return this.http.put<ApiResponse<AddressResponse>>(`${this.addressApiUrl}/${addressId}`, address)
      .pipe(map(response => response.data));
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.addressApiUrl}/${addressId}`)
      .pipe(map(response => response.data));
  }

  createAddress(address: AddressRequest): Observable<AddressResponse> {
    return this.http.post<ApiResponse<AddressResponse>>(this.addressApiUrl, address)
      .pipe(map(response => response.data));
  }

  updateDefaultAddress(address: AddressRequest): Observable<AddressResponse> {
    // First try to get the default shipping address
    return this.getDefaultShippingAddress().pipe(
      switchMap((existingAddress: AddressResponse) => {
        if (existingAddress) {
          // If exists, update it
          return this.updateAddress(existingAddress.id, {
            ...address,
            type: 'shipping',
            isDefault: true
          });
        } else {
          // If doesn't exist, create new
          return this.createAddress({
            ...address,
            type: 'shipping',
            isDefault: true
          });
        }
      })
    );
  }
}
