import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { Observable } from 'rxjs';
import { User, UserResponse } from '#types/user';
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApi = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Get all users
  getUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(this.userApi);
  }

  // Get user by ID
  getUser(id: number): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.userApi}/${id}`);
  }

  // Create new user
  createUser(user: Partial<User>): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(this.userApi, user);
  }

  // Update user
  updateUser(id: number, user: Partial<User>): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.userApi}/${id}`, user);
  }

  // Delete user
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.userApi}/${id}`);
  }

  // Update user role
  updateUserRole(userId: number, roleIds: number[]): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.userApi}/${userId}/roles`, { roleIds });
  }

  // Assign user roles
}