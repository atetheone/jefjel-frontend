import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserResponse } from '#types/user';
import { ApiResponse } from '#types/api_response'
import { UserRegistrationResponse } from '#types/user_registration_response';
import { LoginResponse } from '#types/login_response';
import { LoginRequest } from '#types/login_request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Tracks login state
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable(); // Exposed as observable
  private apiUrl = environment.apiUrl;
  userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();
  userPermissions: string[] = [];

  private isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { 
    const token = localStorage.getItem('token');
    const storedPermissions = localStorage.getItem('permissions');
    const storedUser = localStorage.getItem('user');

    if (token) {
      this.isLoggedInSubject.next(true);

      if (storedPermissions) {
        this.userPermissions = JSON.parse(storedPermissions);
      }
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
      this.getUser().subscribe({
        error: () => {
          this.logout();
        }
      });
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  registerUser(user: User): Observable<UserRegistrationResponse> {
    return this.http.post<UserRegistrationResponse>(`${this.apiUrl}/auth/register-user`, user);
  }

  login({ email, password }: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.handleSuccessResponse(response)),
        catchError((err) => this.handleErrorResponse(err))
      );
  }

  getUser(): Observable<UserResponse> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/me`).pipe(
      map((response) => {
        this.userSubject.next(response.data);
        this.userPermissions = this.getUserPermissions(response.data);
        return response.data;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('user');
    
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.userPermissions = [];
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    return true;
  }

  resetPassword(token: string, password: string): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.apiUrl}/auth/set-password/${token}`, { password });
  }

  // requestPasswordReset(email: string): Observable<ApiResponse<void>> {
  //   return this.http.post<ApiResponse<void>>(`${this.apiUrl}/auth/forgot-password`, { email });
  // }
  requestPasswordReset(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/auth/forgot-password`, 
      { email }
    ).pipe(
      catchError(error => {
        this.showToast(error.message || 'Failed to send reset email', 'error');
        return throwError(() => error);
      })
    );
  }

  verify(token: string): Observable<ApiResponse<void>> {
    return this.http.get<ApiResponse<void>>(`${this.apiUrl}/auth/verify/${token}`);
  }
  
  resendVerification(token: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/auth/verify/resend`, { token });
  }

  private getUserPermissions(user: UserResponse): string[] {
    const permissions =  user.roles.flatMap(role => 
      role.permissions.map(permission => 
        `${permission.action}:${permission.resource}`
      )
    );
    localStorage.setItem('permissions', JSON.stringify(permissions));
    return permissions;
  }

  hasPermissions(permissions: string[]): boolean {
    const storedPermissions = localStorage.getItem('permissions');
    if (!storedPermissions) {
      return false;
    }
    const userPerms = JSON.parse(storedPermissions);
    return permissions.every(permission => 
      userPerms.includes(permission)
    );
  }


  private handleSuccessResponse(response: LoginResponse, message: string = '', type: 'log' | 'reg' = 'log') {

    this.getUser();
    if (response.success) { 
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      this.userSubject.next(response.data!.user);
      this.isLoggedInSubject.next(true);

      // Update permissions
      this.userPermissions = this.getUserPermissions(response.data.user);
      

      this.showToast('Login successful', 'success');
    }

  }

  private handleErrorResponse(error: any): Observable<never> {
    console.error('Login failed:', error); 
    this.isLoggedInSubject.next(false);

    this.showToast(error.message, 'error');

    return throwError(() => new Error('Login failed. Please try again!'));
  }

  // Toast notification method
  private showToast(message: string, type: 'success' | 'error'): void {
    console.log('Showing snack bar...');
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Toast duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`${type}-toast`, 'custom-toast'] // Apply custom styles based on type
    });
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }
}
