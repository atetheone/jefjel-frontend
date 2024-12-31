import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { permissionGuard } from '#guards/permission.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent,
        canActivate: [() => permissionGuard(['read:products'])],
        data: { breadcrumb: 'Products' }
      },
      {
        path: 'create',
        loadComponent: () => import('./create-product/create-product.component')
          .then(m => m.CreateProductComponent),
        canActivate: [() => permissionGuard(['create:products'])],
        data: { breadcrumb: 'Create Product' }
      },
      {
        path: ':id',
        loadComponent: () => import('./product-details/product-details.component')
          .then(m => m.ProductDetailsComponent),
        canActivate: [() => permissionGuard(['read:products', 'update:products'])],
        data: { breadcrumb: 'Product Details' }
      }
    ]
  }
];