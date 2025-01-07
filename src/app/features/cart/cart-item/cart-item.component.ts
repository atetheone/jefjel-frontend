import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { CartItem } from '#types/cart';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() quantityChanged = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();


  updateQuantity(quantity: number) {
    if (quantity >= 1 && quantity <= (this.item.product.inventory.quantity || 0)) {
      this.quantityChanged.emit(quantity);
    }
  }

  getSubTotal() {
    return (+(this.item.product.basePrice || this.item.product.price)  * this.item.quantity)
  }
}