import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ProductService } from '#shared/services/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '#types/product';
import { catchError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, MaterialModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.sass'
})
export class ProductDetailsComponent implements OnInit {
  private productSubject = new BehaviorSubject<DataState<ProductResponse>>({
    status: 'idle',
    error: null
  });

  productDetails$ = this.productSubject.asObservable();
  product!: ProductResponse;
  isAdmin = false; // Set based on your auth service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngAfterViewInit() {
    this.productDetails$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.product = state.data;
      }
    })
 
  }

  ngOnInit() {
    const productId = this.route.snapshot.params['id'];
    this.productSubject.next({ status: 'loading', error: null });

    this.productService.getProductById(productId).pipe(
      map(productResponse => {
        console.table(productResponse);
        return {
          status: 'success' as const,
          data:  productResponse,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: error.message || 'Failed to load product details'
      })),
    ).subscribe(state => this.productSubject.next(state))
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }
}