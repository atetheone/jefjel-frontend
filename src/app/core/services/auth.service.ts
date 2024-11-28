import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User, UserResponse } from '#types/user';
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
    private http: HttpClient
  ) { 
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  registerUser(user: User): Observable<UserRegistrationResponse> {
    return this.http.post<UserRegistrationResponse>(`${this.apiUrl}/auth/register`, user);
  }

  login({ email, password }: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((response: any) => { 
          if (response.success) { 
            localStorage.setItem('token', response.token);
            this.userSubject.next(response.data);
            this.isLoggedInSubject.next(true);
          }
          return response;
        })
      )
  }

  getUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`).pipe(
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
}
