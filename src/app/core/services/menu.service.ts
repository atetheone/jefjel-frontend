import { Injectable } from '@angular/core';
import { MenuItem } from '#types/menu'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient
  ) { }

  getMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard', 
        icon: 'dashboard', 
        route: '/dashboard'
      },
      {
        label: 'User management', 
        icon: 'people', 
        route: '/dashboard/users'
      },
      {
        label: 'Tenant management', 
        icon: 'business', 
        route: '/dashboard/tenants'
      },
      {
        label: 'Roles & Permissions', 
        icon: 'security', 
        route: '/dashboard/roles'
      },
      // {
      //   label: 'Analytics', 
      //   icon: 'analytics', 
      //   route: '/analytics'
      // }
    ];
  }
}
