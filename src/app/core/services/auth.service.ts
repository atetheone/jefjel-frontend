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
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  private isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { 
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  registerUser(user: User): Observable<UserRegistrationResponse | unknown> {
    return this.http.post<UserRegistrationResponse>(`${this.apiUrl}/auth/register-user`, user)
      .pipe(
        tap((response: UserRegistrationResponse) => {
          this.showToast('Registration done successfully', 'success')
        }),
        catchError((err) => {
          this.showToast('Registration failed', 'error');

          return err
        })
      )
  }

  login({ email, password }: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.handleSuccessResponse(response)),
        catchError((err) => this.handleErrorResponse(err))
      );
  }

  getUser(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/me`).pipe(
      map((user) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false)
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


  private handleSuccessResponse(response: LoginResponse, message: string = '', type: 'log' | 'reg' = 'log') {

    if (response.success) { 
      localStorage.setItem('token', response.data.token);
      this.userSubject.next(response.data.user);
      this.isLoggedInSubject.next(true);

      this.showToast('Login successful', 'success');
    }

  }

  private handleErrorResponse(error: any): Observable<never> {
    console.error('Login failed:', error); // Log the error
    this.isLoggedInSubject.next(false); // Update logged-in state

    this.showToast('Login failed', 'error'); // Show toast notification

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
}
