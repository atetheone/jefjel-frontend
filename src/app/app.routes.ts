import { Routes } from '@angular/router';

import { LoginComponent } from '#features/auth/login/login.component';
import { RegisterComponent } from '#features/auth/register/register.component';
import { SetPasswordComponent } from '#features/auth/set-password/set-password.component';
import { PasswordForgottenComponent } from '#features/auth/password-forgotten/password-forgotten.component';
import { VerifyAccountComponent } from '#features/auth/verify-account/verify-account.component';
import { DashboardComponent } from '#features/dashboard/dashboard.component';
import { DefaultLayoutComponent } from '#layouts/default-layout/default-layout.component';
import { AdminLayoutComponent } from '#layouts/admin-layout/admin-layout.component';
import { MarketplaceComponent } from '#features/marketplace/marketplace.component';
import { UsersComponent } from '#features/users/users.component';
import { CreateUserComponent } from '#features/users/create-user/create-user.component';
import { UserDetailsComponent } from '#features/users/user-details/user-details.component';
import { TenantsComponent } from '#features/tenants/tenants.component';
import { TenantDetailsComponent } from '#features/tenants/tenant-details/tenant-details.component';
import { CreateTenantComponent } from '#features/tenants/create-tenant/create-tenant.component';
import { RolesComponent } from '#features/roles/roles.component';
import { CreateRoleComponent } from '#features/roles/create-role/create-role.component'
import { RoleDetailsComponent } from '#features/roles/role-details/role-details.component'
import { ProfileComponent } from '#features/dashboard/components/profile/profile.component';
import { CartOverviewComponent } from '#features/cart/cart-overview/cart-overview.component';
import { CheckoutComponent } from '#features/checkout/checkout.component';
import { OrdersComponent } from '#features/orders/orders.component'

import { USER_ROUTES } from '#features/users/users.routes';
import { ROLES_ROUTES } from '#features/roles/roles.routes';
import { TENANTS_ROUTES } from '#features/tenants/tenants.routes';
import { PRODUCTS_ROUTES } from '#features/products/products.routes';
import { MARKETPLACE_ROUTES } from '#features/marketplace/marketplace.routes';

import { authGuard } from '#guards/auth.guard';
import { adminGuard } from '#guards/admin.guard';
import { permissionGuard } from '#guards/permission.guard';
import { OrderDetailsComponent } from './features/orders/order-details/order-details.component';
import { guestGuard } from '#guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent, 
    children: [
      { 
        path: '', 
        component: MarketplaceComponent
      },
      {
        path: 'markets', 
        children: MARKETPLACE_ROUTES
      }, 
      {
        path: 'cart',
        component: CartOverviewComponent,
        data: { breadcrumb: 'Shopping Cart' }
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: { breadcrumb: 'Checkout' },
        canActivate: [authGuard],

      },
      { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [guestGuard],
        data: { breadcrumb: 'Login' }
      },
      { path: 'register', component: RegisterComponent },
      { path: 'password-reset', component: PasswordForgottenComponent },
      { path: 'verify/:token', component: VerifyAccountComponent },

    ]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { 
        path: '', 
        component: DashboardComponent,
        canActivate: [() => permissionGuard(['read:dashboard'])]
      },
      { path: 'tenants', children: TENANTS_ROUTES },
      { 
        path: 'users', 
        children: USER_ROUTES,
      },
      { path: 'roles', children: ROLES_ROUTES },
      { path: 'products', children: PRODUCTS_ROUTES },
      {
        path: 'orders',
        children: [
          {
            path: '',
            component: OrdersComponent,
            data: { breadcrumb: 'Orders' }
          },
          {
            path: ':id',
            component: OrderDetailsComponent,
            data: { breadcrumb: 'Order Details' }
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/dashboard/components/profile/profile.component')
          .then(m => m.ProfileComponent),
        data: { breadcrumb: 'User profile' }
      }
    ]
  },
  {
    path: 'set-password/:token',
    component: SetPasswordComponent
  }
];
