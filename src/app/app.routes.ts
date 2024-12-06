import { Routes } from '@angular/router';

import { LoginComponent } from '#features/auth/login/login.component';
import { RegisterComponent } from '#features/auth/register/register.component';
import { SetPasswordComponent } from '#features/auth/set-password/set-password.component';
import { DashboardComponent } from '#features/dashboard/dashboard.component';
import { DefaultLayoutComponent } from '#layouts/default-layout/default-layout.component';
import { AdminLayoutComponent } from '#layouts/admin-layout/admin-layout.component';
import { MarketplaceComponent } from '#features/marketplace/marketplace.component';
import { UsersComponent } from '#features/users/users.component';
import { TenantsComponent } from '#features/tenants/tenants.component';
import { RolesComponent } from '#features/roles/roles.component';


import { authGuard } from '#core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent, 
    children: [
      { path: '', component: MarketplaceComponent }, 
      { path: 'login', component: LoginComponent }, 
      { path: 'register', component: RegisterComponent },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'marketplace', component: MarketplaceComponent },
      { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'tenants',
        loadComponent: () => import('./features/tenants/tenants.component').then(m => m.TenantsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/roles.component').then(m => m.RolesComponent)
      },
    ]
  },
  {
    path: 'set-password/:token',
    component: SetPasswordComponent
  }
];
