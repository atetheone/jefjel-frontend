import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: 'create',
        loadComponent: () => import('./create-user/create-user.component')
          .then(m => m.CreateUserComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./user-details/user-details.component')
          .then(m => m.UserDetailsComponent)
      }
    ]
  }
];