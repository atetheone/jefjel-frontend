import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { CartResponse, CartItem, AddItemRequest } from '#types/cart'; 
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart() {
    this.getCurrentCart().subscribe(cart => {
      if (cart) {
        this.cartSubject.next(cart);
      }
    });
  }

  getCurrentCart(): Observable<CartResponse> {
    return this.http.get<ApiResponse<CartResponse>>(`${this.baseUrl}/current`).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  getUserCarts(): Observable<CartResponse[]> {
    return this.http.get<ApiResponse<CartResponse[]>>(this.baseUrl).pipe(
      map((response: ApiResponse<CartResponse[]>) => response.data)
    );
  }

  getCartById(cartId: number): Observable<CartResponse> {
    return this.http.get<ApiResponse<CartResponse>>(`${this.baseUrl}/${cartId}`).pipe(
      map((response: ApiResponse<CartResponse>) => response.data)
    );
  } 

  createCart(items?: AddItemRequest[]): Observable<CartResponse> {
    return this.http.post<ApiResponse<CartResponse>>(this.baseUrl, { }).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(item: AddItemRequest): Observable<CartResponse> {
    return this.cart$.pipe(
      take(1),
      switchMap(cart => {
        if (!cart) {
          console.log('No active cart, creating new one');
          return this.createCart().pipe(
            switchMap(newCart => {
              this.setActiveCartId(newCart.id);
              return this.addItemToExistingCart(newCart.id, item);
            })
          )
        } else {
          console.log('Using existing cart:', cart.id);
          return this.addItemToExistingCart(cart.id, item);
        }
      })
    );
  }

  private addItemToExistingCart(cartId: number, request: AddItemRequest): Observable<CartResponse> {
    console.log('Adding item to cart:', { cartId, request });
    const url = `${this.baseUrl}/${cartId}/items`;
    return this.http.post<ApiResponse<CartResponse>>(url, request)
      .pipe(
        tap({
          next: (response) => console.log('Add item response:', response),
          error: (error) => console.error('Add item failed:', error)
        }),
        map(response => response.data),
        tap(cart => this.cartSubject.next(cart))
      );
  }

  updateCartItem(itemId: number, quantity: number): Observable<CartResponse> {
    return this.http.patch<ApiResponse<CartResponse>>(`${this.baseUrl}/items/${itemId}`, {
      quantity
    }).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }


  removeFromCart(itemId: number): Observable<CartResponse> {
    return this.http.delete<ApiResponse<CartResponse>>(`${this.baseUrl}/items/${itemId}`)
      .pipe(
        map(response => response.data),
        tap(cart => this.cartSubject.next(cart))
      );
  }

  clearCart(cartId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${cartId}/clear`)
      .pipe(
        map(response => response.data),
        tap(() => this.cartSubject.next(null))
      );
  }

  deleteCart(cartId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${cartId}`)
      .pipe(
        map(response => response.data),
        tap(() => this.cartSubject.next(null))
      );
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0)
    );
  }

  refreshCart(): void {
    this.loadCart();
  }

  getActiveCartId(): number | null {
    return Number(localStorage.getItem('activeCartId'));
  }


  setActiveCartId(cartId: number): void {
    localStorage.setItem('activeCartId', cartId + "");
  }
}