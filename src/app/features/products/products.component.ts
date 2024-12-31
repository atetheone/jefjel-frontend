import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '#shared/services/toast.service';
import { ProductService } from '#shared/services/product.service';
import { ProductResponse } from '#types/product';
import { DataState } from '#types/data_state';
import { ProductCardComponent } from './product-card/product-card.component'
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule, 
    MaterialModule, 
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.sass'
})
export class ProductsComponent implements OnInit {
  private productsSubject = new BehaviorSubject<DataState<ProductResponse[]>>({
    status: 'loading',
    data: [],
    error: null
  });
  viewModel$ = this.productsSubject.asObservable();
  
  displayedColumns: string[] = ['name', 'sku', 'price', 'stock', 'categories', 'status', 'actions'];
  dataSource = new MatTableDataSource<ProductResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadProducts() {
    this.productsSubject.next({ status: 'loading', data: [], error: null });

    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productsSubject.next({
          status: 'success',
          data: response.data,
          error: null
        });
      },
      error: (error) => {
        this.productsSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load products'
        });
        console.error('Error loading products:', error);
      }
    });
  }

  confirmDeleteProduct(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(id);
      }
    })
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.loadProducts();
      },
      error: (error) => {
        this.toastService.error(error.message);
        console.error('Error deleting product:', error);
      }
    });
  }


}