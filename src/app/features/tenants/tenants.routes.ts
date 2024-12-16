import { Routes } from '@angular/router';
import { TenantsComponent } from './tenants.component';
import { permissionGuard } from '#guards/permission.guard';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TenantsComponent,
        canActivate: [() => permissionGuard(['read:tenants'])]
      },
      {
        path: 'create',
        loadComponent: () => import('./create-tenant/create-tenant.component')
          .then(m => m.CreateTenantComponent),
        canActivate: [() => permissionGuard(['create:tenants'])],
        data: { breadcrumb: 'Create tenant' }
      },
      {
        path: 'create/:id',
        loadComponent: () => import('./create-tenant/create-tenant.component')
          .then(m => m.CreateTenantComponent),
        canActivate: [() => permissionGuard(['update:tenants'])],
        data: { breadcrumb: 'Update User' }
      },
      {
        path: ':id',
        loadComponent: () => import('./tenant-details/tenant-details.component')
          .then(m => m.TenantDetailsComponent),
        canActivate: [() => permissionGuard(['read:tenants', 'update:tenants'])],
        data: { breadcrumb: 'Tenant details' }
      }
    ]
  }
];