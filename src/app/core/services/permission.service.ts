import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { PermissionResponse } from '#types/permission';
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  apiUrl = `${environment.apiUrl}/permissions`

  constructor(
    private http: HttpClient
  ) { }

  getPermissions(): Observable<ApiResponse<PermissionResponse[]>> {
    return this.http.get<ApiResponse<PermissionResponse[]>>(this.apiUrl);
  }

  createPermission(perm: Partial<PermissionResponse>): Observable<ApiResponse<PermissionResponse>> {
    return this.http.post<ApiResponse<PermissionResponse>>(this.apiUrl, perm);
  }
  
}
