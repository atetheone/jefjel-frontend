import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from '#env/environment';
import { 
  ProductResponse, 
  ProductsResponse,
  CreateProduct,
  UpdateProduct,
  CategoryResponse
} from '#types/product';
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productApi = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.productApi);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ApiResponse<ProductResponse>>(`${this.productApi}/${id}`)
      .pipe(
        map(response => response.data)
      )
  }

  createProduct(product: CreateProduct): Observable<ApiResponse<ProductResponse>> {
    return this.http.post<ApiResponse<ProductResponse>>(this.productApi, product);
  }

  updateProduct(id: number, product: UpdateProduct): Observable<ApiResponse<ProductResponse>> {
    return this.http.put<ApiResponse<ProductResponse>>(`${this.productApi}/${id}`, product);
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.productApi}/${id}`);
  }

  uploadProductImages(productId: number, images: File[]): Observable<ApiResponse<ProductResponse>> {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    return this.http.post<ApiResponse<ProductResponse>>(
      `${this.productApi}/${productId}/images/`,
      formData
    );
  }


  deleteProductImage(productId: number, imageId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.productApi}/${productId}/images/${imageId}`
    );
  }

  updateProductCategories(productId: number, categoryIds: number[]): Observable<ApiResponse<ProductResponse>> {
    return this.http.put<ApiResponse<ProductResponse>>(
      `${this.productApi}/${productId}/categories`,
      { categoryIds }
    );
  }
}