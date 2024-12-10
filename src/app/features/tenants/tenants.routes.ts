import { Routes } from '@angular/router';
import { TenantsComponent } from './tenants.component';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TenantsComponent
      },
      {
        path: 'create',
        loadComponent: () => import('./create-tenant/create-tenant.component')
          .then(m => m.CreateTenantComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./tenant-details/tenant-details.component')
          .then(m => m.TenantDetailsComponent)
      }
    ]
  }
];