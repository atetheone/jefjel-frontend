import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '#shared/services/cart.service';
import { AuthService } from '#services/auth.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartResponse, CartItem } from '#types/cart';
import { ToastService } from '#shared/services/toast.service';

@Component({
  selector: 'app-cart-overview',
  imports: [CommonModule, MaterialModule, RouterModule, CartItemComponent],
  templateUrl: './cart-overview.component.html',
  styleUrl: './cart-overview.component.sass'
})
export class CartOverviewComponent {
  cart$: Observable<CartResponse | null>;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$
  }

  ngOnInit() {
    this.cartService.refreshCart();
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      this.toastService.error('Quantity must be at least 1');
      return;
    }
    this.cartService.updateCartItem(itemId, quantity).subscribe({
      next: (cart) => {
        this.toastService.success('Quantity updated')
        this.cartService.refreshCart();
      },
      error: () => this.toastService.error('Failed to update quantity')
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => this.toastService.success('Item removed from cart'),
      error: () => this.toastService.error('Failed to remove item')
    });
  }

  clearCart(cartId: number) {
    this.cartService.clearCart(cartId).subscribe({
      next: () => this.toastService.success('Cart cleared'),
      error: () => this.toastService.error('Failed to clear cart')
    });
  }

  getSubtotal(cart: CartResponse): number {
    if (!cart?.items?.length) {
      return 0;
    }
    
    const total = cart.items.reduce((total: number, item: CartItem) => {
      const price = Number(item.product.price);
      const quantity = Number(item.quantity);
      return total + (price * quantity);
    }, 0);

    return Number(total.toFixed(2));
  }  

  getTotal(cart: CartResponse): number {
    return this.getSubtotal(cart);
  }

  proceedToCheckout() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
