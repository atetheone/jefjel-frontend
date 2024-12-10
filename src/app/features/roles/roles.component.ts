import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '#shared/material/material.module';
import { RoleService } from '#core/services/role.service';
import { RoleResponse } from '#types/role';
import { PermissionResponse } from '#types/permission';

import { catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';



interface GroupedPermission {
  resource: string;
  actions: string[];
}

@Component({
  selector: 'app-roles',
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'permissions'];
  dataSource = new MatTableDataSource<RoleResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  private rolesSubject = new BehaviorSubject<DataState<RoleResponse[]>>({
    status: 'idle',
    error: null
  });
  viewModel$ = this.rolesSubject.asObservable();

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  loadRoles() {
    this.roleService.getRoles().pipe(
      map(response => {
        console.table(response.data);
        return {
          status: 'success' as const,
          data: response.data,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: error.message
      }))
    ).subscribe(state => {
      this.rolesSubject.next(state);
    })
  }

  editRole(role: RoleResponse) {
    // TODO: Implement role editing dialog
    console.log('Edit role:', role);
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (error) => console.error('Error deleting role:', error)
      });
    }
  }

  groupPermissions(permissions: PermissionResponse[]): GroupedPermission[] {
    const groups = permissions.reduce((acc, permission) => {
      const existing = acc.find(g => g.resource === permission.resource);
      if (existing) {
        existing.actions.push(permission.action);
      } else {
        acc.push({
          resource: permission.resource,
          actions: [permission.action]
        });
      }
      return acc;
    }, [] as GroupedPermission[]);

    return groups.sort((a, b) => a.resource.localeCompare(b.resource));
  }

  navigateToRoleDetails(roleId: number) {
    this.router.navigate(['/dashboard/roles', roleId]);
  }


}
