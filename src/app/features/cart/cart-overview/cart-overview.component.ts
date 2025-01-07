import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { CartService } from '#shared/services/cart.service';
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
    private toastService: ToastService
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
    return cart?.items.reduce((total:number, item: CartItem) => 
      total + (Number(item.product.basePrice) * item.quantity), 0) || 0;
  }

  getTotal(cart: CartResponse): number {
    return this.getSubtotal(cart);
  }

}
