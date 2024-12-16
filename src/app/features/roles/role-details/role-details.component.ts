import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ToastService } from '#services/toast.service'
import { RoleService } from '#services/role.service';
import { PermissionService } from '#services/permission.service';
import { RoleResponse } from '#types/role';
import { PermissionResponse, PermissionGroup } from '#types/permission';


@Component({
  selector: 'app-role-details',
  imports: [MaterialModule, CommonModule],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.sass'
})
export class RoleDetailsComponent implements OnInit {
  roleData: RoleResponse | null = null;
  permissionGroups: PermissionGroup[] = [];
  selectedPermissions: number[] = [];
  hasChanges = false;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoleAndPermissions();
  }

  loadRoleAndPermissions() {
    const roleId = this.route.snapshot.params['id'];
    
    // Load role data
    this.roleService.getRole(roleId).subscribe({
      next: (roleResponse) => {
        this.roleData = roleResponse.data;
        
        // Load all permissions and mark selected ones
        this.permissionService.getPermissions().subscribe({
          next: (permResponse) => {
            this.initializePermissionGroups(permResponse.data);
          },
          error: (error) => {
            console.error('Error loading permissions:', error);
            this.toastService.error("Error when loading permissions")
          }
        });
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.toastService.error('Error when loading the role')
      }
    });
  }

  initializePermissionGroups(permissions: PermissionResponse[]) {
    const groups = permissions.reduce((acc, permission) => {
      const existingGroup = acc.find(g => g.resource === permission.resource);
      const isSelected = this.roleData?.permissions.some(p => p.id === permission.id);
      
      if (isSelected) {
        this.selectedPermissions.push(permission.id);
      }

      if (existingGroup) {
        existingGroup.actions.push({
          id: permission.id,
          action: permission.action,
          selected: isSelected || false
        });
      } else {
        acc.push({
          resource: permission.resource,
          actions: [{
            id: permission.id,
            action: permission.action,
            selected: isSelected || false
          }]
        });
      }
      return acc;
    }, [] as PermissionGroup[]);

    this.permissionGroups = groups.sort((a, b) => 
      a.resource.localeCompare(b.resource)
    );
  }

  togglePermission(action: { id: number, selected: boolean }) {
    if (this.isLastSelectedPermission(action) && action.selected) {
      return; // Prevent unchecking the last permission
    }

    action.selected = !action.selected;
    this.hasChanges = true;

    if (action.selected) {
      this.selectedPermissions.push(action.id);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== action.id);
    }
  }

  isLastSelectedPermission(action: { id: number, selected: boolean }): boolean {
    return this.selectedPermissions.length === 1 && 
           action.selected;
  }

  saveChanges() {
    if (this.roleData && this.selectedPermissions.length > 0) {
      const updatedRole = {
        ...this.roleData,
        permissionIds: this.selectedPermissions
      };

      console.table(updatedRole);
      this.roleService.updateRole(this.roleData.id, updatedRole).subscribe({
        next: (response) => {
          this.toastService.success(`${response.message}`)
          this.router.navigate(['/dahsboard/roles']);
        },
        error: (error) => console.error('Error updating role:', error)
      });
    }
  }
  
}