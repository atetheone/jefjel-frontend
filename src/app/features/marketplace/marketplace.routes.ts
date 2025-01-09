import { Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace.component';
import { MarketsComponent } from './markets/markets.component';
import { MarketDetailsComponent } from './market-details/market-details.component';
import { MarketplaceProductDetailsComponent } from './components/product-details/product-details.component';

export const MARKETPLACE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MarketsComponent,
      },
      {
        path: ':id',
        component: MarketDetailsComponent,
        children: [
          // { path: '', redirectTo: 'products', pathMatch: 'full' },
          // { path: 'products', component: ProductListComponent },
          
          // { path: 'about', component: AboutComponent },
          // { path: 'contact', component: ContactComponent }
        ]
      },
      { 
        path: ':marketId/products/:id', 
        component: MarketplaceProductDetailsComponent,
        data: { breadcrumb: 'Product Details' }
      },
    ]
  }
];