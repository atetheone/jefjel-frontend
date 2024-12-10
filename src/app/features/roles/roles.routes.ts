import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RolesComponent
      },
      {
        path: 'create',
        loadComponent: () => import('./create-role/create-role.component')
          .then(m => m.CreateRoleComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./role-details/role-details.component')
          .then(m => m.RoleDetailsComponent)
      }
    ]
  }
];