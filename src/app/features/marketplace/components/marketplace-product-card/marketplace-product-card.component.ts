import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { ProductResponse } from '#types/product';

@Component({
  selector: 'app-marketplace-product-card',
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule],
  templateUrl: './marketplace-product-card.component.html',
  styleUrl: './marketplace-product-card.component.sass'
})
export class MarketplaceProductCardComponent {
  @Input({ required: true }) product!: ProductResponse;
  @Output() addToCart = new EventEmitter<{ product: ProductResponse, quantity: number }>();
  quantity = 1;

  onAddToCart(): void {
    if (this.quantity > 0 && this.quantity <= (this.product.inventory?.quantity || 0)) {
      this.addToCart.emit({ product: this.product, quantity: this.quantity });
    }
  }

  isOutOfStock(): boolean {
    return !this.product.inventory?.quantity || this.product.inventory.quantity <= 0;
  }

}
