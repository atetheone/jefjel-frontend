// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-role',
//   imports: [],
//   templateUrl: './create-role.component.html',
//   styleUrl: './create-role.component.sass'
// })
// export class CreateRoleComponent {

// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RoleService } from '#services/role.service';
import { PermissionService } from '#services/permission.service';
import { ToastService } from '#services/toast.service';
import { Permission, PermissionResponse, PermissionGroup } from '#types/permission';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [
    MaterialModule, 
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.sass'
})
export class CreateRoleComponent implements OnInit {
  roleForm: FormGroup;
  permissionGroups: PermissionGroup[] = [];
  selectedPermissions: number[] = [];
  newPermissionResource = new FormControl('');
  newPermissionAction = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionService.getPermissions().subscribe({
      next: (response) => {
        this.groupPermissions(response.data);
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.toastService.error('Error: ' + error);
      }
    });
  }

  groupPermissions(permissions: PermissionResponse[]) {
    const groups = permissions.reduce((acc, permission) => {
      const existingGroup = acc.find(g => g.resource === permission.resource);
      if (existingGroup) {
        existingGroup.actions.push({
          id: permission.id,
          action: permission.action,
          selected: false
        });
      } else {
        acc.push({
          resource: permission.resource,
          actions: [{
            id: permission.id,
            action: permission.action,
            selected: false
          }]
        });
      }
      return acc;
    }, [] as PermissionGroup[]);

    this.permissionGroups = groups.sort((a, b) => 
      a.resource.localeCompare(b.resource)
    );
  }

  togglePermission(resource: string, action: { id: number, selected: boolean }) {
    action.selected = !action.selected;
    if (action.selected) {
      this.selectedPermissions.push(action.id);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== action.id);
    }
  }

  addNewPermission() {
    const newPermission = {
      resource: this.newPermissionResource.value!,
      action: this.newPermissionAction.value!
    };

    this.permissionService.createPermission(newPermission).subscribe({
      next: (response) => {
        // Add new permission to groups and reset form
        const permission = response.data;
        this.addPermissionToGroups(permission);
        this.newPermissionResource.reset();
        this.newPermissionAction.reset();
      },
      error: (error) => console.error('Error creating permission:', error)
    });
  }

  private addPermissionToGroups(permission: PermissionResponse) {
    const existingGroup = this.permissionGroups.find(g => 
      g.resource === permission.resource
    );

    if (existingGroup) {
      existingGroup.actions.push({
        id: permission.id,
        action: permission.action,
        selected: false
      });
    } else {
      this.permissionGroups.push({
        resource: permission.resource,
        actions: [{
          id: permission.id,
          action: permission.action,
          selected: false
        }]
      });
      this.permissionGroups.sort((a, b) => 
        a.resource.localeCompare(b.resource)
      );
    }
  }

  onSubmit() {
    if (this.roleForm.valid && this.selectedPermissions.length > 0) {
      const roleData = {
        ...this.roleForm.value,
        permissionIds: this.selectedPermissions
      };

      this.roleService.createRole(roleData).subscribe({
        next: () => {
          this.router.navigate(['/admin/roles']);
        },
        error: (error) => console.error('Error creating role:', error)
      });
    }
  }
}

