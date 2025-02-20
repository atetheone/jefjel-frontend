import { Routes } from '@angular/router';
import { DeliveriesComponent } from './deliveries.component';
import { permissionGuard } from '#guards/permission.guard';

export const DELIVERIES_ROUTES: Routes = [
  {
    path: '',
    component: DeliveriesComponent,
    canActivate: [() => permissionGuard(['read:deliveries'])],
    data: { breadcrumb: 'My Deliveries' }
  }
];