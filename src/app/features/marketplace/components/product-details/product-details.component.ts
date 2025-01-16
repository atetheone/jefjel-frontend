import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MarketService } from '../../services/market.service';
import { ProductService } from '#shared/services/product.service';
import { CartService } from '#shared/services/cart.service';
import { ToastService } from '#shared/services/toast.service';
import { ProductResponse, CategoryResponse, ProductImageResponse } from '#types/product';

import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { DataState } from '#types/data_state';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule, 
    MaterialModule, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.sass'
})
export class MarketplaceProductDetailsComponent implements OnInit {
  productId!: number
  quantity: number = 1;
  selectedImageIndex: number = 0

  private productSubject = new BehaviorSubject<DataState<ProductResponse>>({
    status: 'loading',
    error: null
  });
  product$ = this.productSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) { } 
  ngOnInit() {

    this.productId = Number(this.route.snapshot.params['id']);

    this.loadProduct(this.productId)
  }

  loadProduct(productId: number) {
    const marketId = Number(this.route.snapshot.params['marketId']);

    this.marketService.getProductById(marketId, productId).pipe(
      map(product => {
        console.log(`Product: ${JSON.stringify(product, null, 2)}`)
        return {
          status: 'success' as const,
          data: product,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: 'Failed to load product details'
      }))
    ).subscribe(state => this.productSubject.next(state));
  }

  addToCart(product: ProductResponse) {
    const cartId = this.cartService.getActiveCartId();
    this.cartService.addToCart({
      product: product,
      quantity: this.quantity
    }).subscribe({
      next: (cart) => {
        this.toastService.success('Added to cart');
        this.quantity = 1;
      },
      error: (error) => {
        this.toastService.error('Failed to add to cart');
        console.error('Add to cart error:', error);
      }
    })

  }

  isOutOfStock(product: ProductResponse): boolean {
    return !product.inventory?.quantity || product.inventory.quantity <= 0;
  }

  getStockStatus(product: ProductResponse): string {
    if (!product.inventory?.quantity) return 'Out of Stock';
    if (product.inventory.quantity <= product.inventory.lowStockThreshold) {
      return `Low Stock (${product.inventory.quantity} left)`;
    }
    return `In Stock (${product.inventory.quantity} available)`;
  }
}