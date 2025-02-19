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

  getPermissionGroups(): any {
    throw new Error("Method not implemented.");
  }

  updatePermission(permId: number, perm: Partial<PermissionResponse>): Observable<ApiResponse<PermissionResponse>> {
    return this.http.put<ApiResponse<PermissionResponse>>(`${this.apiUrl}/${permId}`, perm);
  }

  deletePermission(permId: number): Observable<ApiResponse<PermissionResponse>> {
    return this.http.delete<ApiResponse<PermissionResponse>>(`${this.apiUrl}/${permId}`);
  }
  
}
