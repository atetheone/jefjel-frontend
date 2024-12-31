import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  MarketResponse,
  Market 
} from '#types/marketplace';
import { ProductResponse } from '#types/product';
import { PaginatedResponse } from '#types/paginated_response'; 
import { ApiResponse } from '#types/api_response';
import { environment } from '#env/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  apiUrl = `${environment.apiUrl}/markets`

  constructor(
    private http: HttpClient
  ) { }

  getAllMarkets(): Observable<Market[]> {
    return this.http.get<ApiResponse<Market[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data)
    );    
  }

  getFeaturedMarkets(): Observable<Market[]> {
    return this.http.get<MarketResponse>(`${this.apiUrl}/featured`).pipe(
      map((response) => response.data)

    );
  }

  getMarketById(marketId: number): Observable<Market> {
    return this.http.get<ApiResponse<Market>>(`${this.apiUrl}/${marketId}`).pipe(
      map(response => response.data)
    )
  }

  getMarketProducts(marketId: number, pageNumber: number): Observable<ProductResponse[]> {
    return this.http.get<ApiResponse<PaginatedResponse<ProductResponse[]>>>(`${this.apiUrl}/${marketId}/products?page=${pageNumber}`)
      .pipe(
        map(paginatedResponse => paginatedResponse.data.data)
      )
  }

  getFeaturedProducts(): Observable<ProductResponse[]> {
    return this.http.get<ApiResponse<PaginatedResponse<ProductResponse[]>>>(`${this.apiUrl}/products/featured`)
      .pipe(
        map(paginatedResponse => paginatedResponse.data.data)
      )
  }

  getProductById(marketId: number, productId: number): Observable<ProductResponse> {
    return this.http.get<ApiResponse<ProductResponse>>(`${this.apiUrl}/${marketId}/products/${productId}`)
      .pipe(
        map(response => response.data)
      )
  }
}
