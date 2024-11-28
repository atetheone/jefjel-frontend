import { Routes } from '@angular/router';

import { LoginComponent } from '#features/auth/login/login.component';
import { RegisterComponent } from '#features/auth/register/register.component';
import { DashboardComponent } from '#features/dashboard/dashboard.component';
import { DefaultLayoutComponent } from '#layouts/default-layout/default-layout.component';
import { AdminLayoutComponent } from '#layouts/admin-layout/admin-layout.component';
import { authGuard } from '#core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('#features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('#features/auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('#features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    ]
  }
];
