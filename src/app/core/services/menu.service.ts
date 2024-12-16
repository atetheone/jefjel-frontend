import { Injectable } from '@angular/core';
import { MenuItem, MenuResponse } from '#types/menu'
import { Observable, BehaviorSubject, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { AuthService } from './auth.service';
import { environment } from '#env/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuApi = `${environment.apiUrl}/menus`;
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  menu$ = this.menuSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuResponse>(`${this.menuApi}/structure`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching menu:', error);
        return of([]);
      })
    );
  }

  loadMenu(): void {
    this.getMenuItems().subscribe(menu => {
      this.menuSubject.next(menu);
    });
  }

  getUserMenu(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(`${this.menuApi}/structure`)

  }


  // filteredMenus(): MenuItem[] {
  //   const filteredMenu =  this.filterMenusByPermissions(this.getMenuItems());
  //   console.log(JSON.stringify(filteredMenu, null, 3));
  //   return filteredMenu;
  //   // return this.getMenuItems();

  // }
}
