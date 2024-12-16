import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { permissionGuard } from '#guards/permission.guard';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RolesComponent,
        canActivate: [() => permissionGuard(['read:roles'])]
      },
      {
        path: 'create',
        loadComponent: () => import('./create-role/create-role.component')
          .then(m => m.CreateRoleComponent),
        canActivate: [() => permissionGuard(['create:roles'])],
        data: { breadcrumb: 'Create role' }
      },
      {
        path: ':id',
        loadComponent: () => import('./role-details/role-details.component')
          .then(m => m.RoleDetailsComponent),
        canActivate: [() => permissionGuard(['read:roles', 'update:roles'])],
        data: { breadcrumb: 'Role details' }
      }
    ]
  }
];