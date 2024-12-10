import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { 
  Tenant, 
  TenantResponse,
  CreateTenantRequest,
  UpdateTenantRequest
} from '#types/tenant'
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  tenantsApiUrl = `${environment.apiUrl}/tenants`;

  constructor(
    private http: HttpClient
  ) { }

  getTenants(): Observable<ApiResponse<TenantResponse[]>> {
    return this.http.get<ApiResponse<TenantResponse[]>>(this.tenantsApiUrl);
  }

  getTenantById(tenantId: number): Observable<ApiResponse<TenantResponse>> {
    return this.http.get<ApiResponse<TenantResponse>>(`${this.tenantsApiUrl}/${tenantId}`);
  }

  createTenant(tenant: CreateTenantRequest): Observable<ApiResponse<TenantResponse>> {
    return this.http.post<ApiResponse<TenantResponse>>(this.tenantsApiUrl, tenant);
  }

  updateTenant(tenantId: number, tenant: UpdateTenantRequest): Observable<ApiResponse<TenantResponse>> {
    return this.http.put<ApiResponse<TenantResponse>>(`${this.tenantsApiUrl}/${tenantId}`, tenant);
  }
}
