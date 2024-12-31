import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { CategoryResponse } from '#types/product';
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryApi = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<CategoryResponse[]>> {
    return this.http.get<ApiResponse<CategoryResponse[]>>(this.categoryApi);
  }
}