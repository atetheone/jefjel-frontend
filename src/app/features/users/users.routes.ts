import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { permissionGuard } from '#guards/permission.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UsersComponent,
        canActivate: [() => permissionGuard(['read:users'])],
        data: { breadcrumb: 'Users' }
      },
      {
        path: 'create',
        loadComponent: () => import('./create-user/create-user.component')
          .then(m => m.CreateUserComponent),
        canActivate: [() => permissionGuard(['create:users'])],
        data: { breadcrumb: 'Create User' }
      },
      {
        path: ':id',
        loadComponent: () => import('./user-details/user-details.component')
          .then(m => m.UserDetailsComponent),
        canActivate: [() => permissionGuard(['read:users', 'update:users'])],
        data: { breadcrumb: 'User Details' }
      }
    ]
  }
];