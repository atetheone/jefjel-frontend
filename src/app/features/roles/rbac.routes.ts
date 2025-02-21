import { Routes } from '@angular/router';
import { RbacComponent } from './rbac.component';
import { permissionGuard } from '#guards/permission.guard';

export const RBAC_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RbacComponent,
        canActivate: [() => permissionGuard(['read:roles'])]
      },
      {
        path: 'create',
        loadComponent: () => import('./roles/create-role/create-role.component')
          .then(m => m.CreateRoleComponent),
        canActivate: [() => permissionGuard(['create:roles'])],
        data: { breadcrumb: 'Create role' }
      },
      {
        path: ':id',
        loadComponent: () => import('./roles/role-details/role-details.component')
          .then(m => m.RoleDetailsComponent),
        canActivate: [() => permissionGuard(['read:roles', 'update:roles'])],
        data: { breadcrumb: 'Role details' }
      }
    ]
  }
];