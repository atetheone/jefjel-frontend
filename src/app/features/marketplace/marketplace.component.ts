import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '#shared/services/toast.service';
import { MarketService } from './services/market.service'
import { ProductResponse } from '#types/product'
import { DataState } from '#types/data_state';
import {
  Market
} from '#types/marketplace';



@Component({
  selector: 'app-marketplace',
  imports: [ 
    MaterialModule, 
    CommonModule, 
    FormsModule,
    RouterModule
  ],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.sass'
})
export class MarketplaceComponent implements OnInit {
  private marketsSubject = new BehaviorSubject<DataState<Market[]>>({
    status: 'loading',
    error: null
  });
  markets$ = this.marketsSubject.asObservable();

  private productsSubject = new BehaviorSubject<DataState<ProductResponse[]>>({
    status: 'loading',
    error: null
  });
  products$ = this.productsSubject.asObservable();


  filteredMarketplaces: Market[] = [];
  selectedCategory = '';
  searchTerm: string = '';
  selectedCategories: { [key: string]: boolean } = {};


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedMarkets();
    // this.loadFeaturedProducts();
  }

  navigateToMarket(marketId: number): void {
    this.router.navigate(['/markets', marketId]);
  }

  navigateToProduct(marketId: number, productId: number): void {
    this.router.navigate(['/markets', marketId, 'products', productId]);
  }

  viewAllMarkets() {
    this.router.navigate(['/markets']);
  }

  loadFeaturedMarkets(): void {
    this.marketService.getFeaturedMarkets().subscribe({
      next: (markets) => {
        this.marketsSubject.next({
          status: 'success',
          data: markets,
          error: null
        });
      },
      error: (error) => {
        this.marketsSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load markets'
        });
      }
    });
  }

private loadFeaturedProducts(): void {
    this.marketService.getFeaturedProducts().subscribe({
      next: (products: ProductResponse[]) => {
        this.productsSubject.next({
          status: 'success',
          data: products,
          error : null
        });
      },
      error: (error) => {
        this.productsSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load products'
        });
      }
    });
  }


}