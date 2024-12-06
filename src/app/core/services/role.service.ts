import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { Observable } from 'rxjs';
import { User, UserResponse } from '#types/user';
import { Role, RoleResponse } from '#types/role'
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleApi = `${environment.apiUrl}/roles`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Get all users
  getRoles(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(this.roleApi);
  }

  // Get user by ID
  getRole(id: number): Observable<ApiResponse<RoleResponse>> {
    return this.http.get<ApiResponse<RoleResponse>>(`${this.roleApi}/${id}`);
  }

  // Create new user
  createRole(role: Partial<Role>): Observable<ApiResponse<RoleResponse>> {
    return this.http.post<ApiResponse<RoleResponse>>(this.roleApi, role);
  }

  // Update user
  updateRole(id: number, role: Partial<Role>): Observable<ApiResponse<RoleResponse>> {
    return this.http.put<ApiResponse<RoleResponse>>(`${this.roleApi}/${id}`, role);
  }

  // Delete user
  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.roleApi}/${id}`);
  }

  // Update user role
  updateUserRole(userId: number, roleIds: number[]): Observable<ApiResponse<RoleResponse>> {
    return this.http.put<ApiResponse<RoleResponse>>(`${this.roleApi}/${userId}/roles`, { roleIds });
  }

  // Assign user roles
}