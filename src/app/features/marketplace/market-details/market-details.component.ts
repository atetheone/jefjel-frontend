import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MarketService } from '../services/market.service';
import { CartService } from '#features/cart/services/cart.service';
import { ToastService } from '#shared/services/toast.service';
import { Market } from '#types/marketplace';
import { ProductResponse } from '#types/product';
import { BehaviorSubject } from 'rxjs';
import { DataState } from '#types/data_state';
import { MarketplaceProductCardComponent } from '../components/marketplace-product-card/marketplace-product-card.component';

@Component({
  selector: 'app-market-details',
  imports: [
    CommonModule, 
    MaterialModule, 
    RouterModule,
    MarketplaceProductCardComponent
  ],
  templateUrl: './market-details.component.html',
  styleUrl: './market-details.component.sass'
})
export class MarketDetailsComponent implements OnInit {
  private marketSubject = new BehaviorSubject<DataState<Market>>({
    status: 'loading',
    error: null
  });
  market$ = this.marketSubject.asObservable();

  private productsSubject = new BehaviorSubject<DataState<ProductResponse[]>>({
    status: 'loading',
    data: [],
    error: null
  });
  products$ = this.productsSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const marketId = Number(this.route.snapshot.params['id']);
    this.loadMarketDetails(marketId);
    this.loadMarketProducts(marketId);
  }

  loadMarketDetails(marketId: number) {
    this.marketService.getMarketById(marketId).subscribe({
      next: (market) => {
        this.marketSubject.next({
          status: 'success',
          data: market,
          error: null
        });
      },
      error: (error) => {
        this.marketSubject.next({
          status: 'error',
          error: 'Failed to load market details'
        });
      }
    });
  }

  addToCart(product: ProductResponse): void {
    // this.cartService.addToCart({
    //   productId: product.id,
    //   name: product.name,
    //   price: product.basePrice || product.price,
    //   quantity: 1,
    //   image: product.images?.[0]?.url || 'assets/images/placeholder.jpg',
    //   marketId: product.tenantId,
    //   marketName: this.marketSubject.value.data?.name || ''
    // });
    this.toastService.success('Added to cart');
  }

  private loadMarketProducts(marketId: number, page: number = 1) {
    this.marketService.getMarketProducts(marketId, page).subscribe({
      next: (products) => {
        this.productsSubject.next({
          status: 'success',
          data: products,
          error: null
        });
      },
      error: (error) => {
        this.productsSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load market products'
        });
      }
    });
  }
}