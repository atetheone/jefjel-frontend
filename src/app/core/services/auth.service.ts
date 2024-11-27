import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '#types/user';
import { UserRegistrationResponse } from '#types/user_registration_response';
import { LoginResponse } from '#types/login_response';
import { LoginCredentials } from '../types/login_credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: User) {
    return this.http.post<UserRegistrationResponse>(`${this.apiUrl}/auth/register`, user);
  }

  login({ email, password }: LoginCredentials): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((response: any) => { 
          if (response.success) { 
            localStorage.setItem('token', response.token);
            this.userSubject.next(response.data);
          }
          return response;
        })
      )
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`).pipe(
      map((user) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
