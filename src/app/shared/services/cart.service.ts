import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from '#services/auth.service';
import { Cart, CartResponse, CartItem, AddItemRequest } from '#types/cart';
import { ProductResponse } from '#types/product'; 
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly GUEST_CART_KEY = 'guest_cart';
  private baseUrl = `${environment.apiUrl}/cart`
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const guestCart = this.getGuestCart();
        if (guestCart.items)
          this.syncCarts(guestCart.items);
      }    
      this.loadCart();
    })
  }

  private syncCarts(items: CartItem[]) {
    items.forEach(item => {
      this.addToCart({
        product: item.product,
        quantity: item.quantity
      }).subscribe();
    });
    localStorage.removeItem(this.GUEST_CART_KEY);
  }

  private loadCart() {
    if (this.authService.isAuthenticated()) {
      this.getCurrentCart().subscribe({
        next: (cart) => this.cartSubject.next(cart),
        error: (error) => this.cartSubject.next(null)
      });
    } else {
      const guestCart = this.getGuestCart();
      this.cartSubject.next(guestCart);
    }
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
    if (!this.authService.isAuthenticated()) {
      return this.addToGuestCart(item);
    }
    return this.cart$.pipe(
      take(1),
      switchMap(cart => {
        if (!cart?.id) {
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

  private addToGuestCart(request: AddItemRequest): Observable<CartResponse> {
    const currentCart = this.getGuestCart();
    const existingItemIndex = currentCart?.items?.findIndex(
      item => item.product.id === request.product.id
    );
    
    if (existingItemIndex > -1) {
      currentCart.items[existingItemIndex].quantity += request.quantity;
    } else {
      const newItem: CartItem = {
        id: Math.floor(Math.random() * 1000000), // Temporary ID for guest cart
        cartId: currentCart.id,
        product: request.product,
        quantity: request.quantity,
      };
      currentCart.items.push(newItem);
    }

    currentCart.updatedAt = new Date().toISOString();
    this.saveGuestCart(currentCart);
    return of(currentCart);
  }

  private addItemToExistingCart(cartId: number, request: AddItemRequest): Observable<CartResponse> {
    console.log('Adding item to cart:', { cartId, request });
    const url = `${this.baseUrl}/${cartId}/items`;
    return this.http.post<ApiResponse<CartResponse>>(url, { 
      productId:request.product.id, 
      quantity: request.quantity
    })
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
    if (!this.authService.isAuthenticated) {
      const currentCart = this.getGuestCart();
      currentCart.items = currentCart.items.filter(item => item.id !== itemId);
      currentCart.updatedAt = new Date().toISOString();
      this.saveGuestCart(currentCart);
      return of(currentCart);
    }
    return this.http.delete<ApiResponse<CartResponse>>(`${this.baseUrl}/items/${itemId}`)
      .pipe(
        map(response => response.data),
        tap(cart => this.cartSubject.next(cart))
      );
  }

  clearCart(cartId: number): Observable<void> {
    if (this.authService.isAuthenticated()) {
      return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${cartId}/clear`)
        .pipe(
          map(response => response.data),
          tap(() => this.cartSubject.next(null))
        );
    } else {
      const emptyCart = this.getGuestCart();
      emptyCart.items = [];
      emptyCart.updatedAt = new Date().toISOString();
      localStorage.removeItem(this.GUEST_CART_KEY);
      this.cartSubject.next(emptyCart);
      return of();
    }
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

  getGuestCart(): CartResponse {
    const savedCart = localStorage.getItem(this.GUEST_CART_KEY);
    if (savedCart) 
      return JSON.parse(savedCart) 
    else {
      return {
        id: 0,
        userId: 0,
        tenantId: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: []
      };
    }
  }

  private saveGuestCart(cart: CartResponse): void {
    localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }
}