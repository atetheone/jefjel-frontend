import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormControl 
} from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { UserService } from '#features/users/services/user.service';
import { RoleService } from '#services/role.service';
import { ToastService } from '#shared/services/toast.service';
import { RoleResponse } from '#types/role';
import { PermissionResponse } from '#types/permission';



@Component({
  selector: 'app-create-user',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.sass'
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  availableRoles: RoleResponse[] = [];
  filteredRoles: RoleResponse[] = []; // 
  roleSearchCtrl = new FormControl(''); //

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles: [[], Validators.required]
    });

    // Filter roles as user types
    this.roleSearchCtrl.valueChanges.subscribe(value => {
      this.filterRoles(value || '');
    });
  }


  ngOnInit() {
    // Fetch available roles
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.availableRoles = response.data;
      },
      error: (error) => console.error('Error fetching roles:', error)
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = {
        ...this.userForm.value,
        status: 'active'
      };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.router.navigate(['/dashboard/users']);
        },
        error: (error) => console.error('Error creating user:', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users']);
  }

  private filterRoles(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredRoles = this.availableRoles.filter(role =>
      role.name.toLowerCase().includes(filterValue)
    );
  }

  groupPermissions(permissions: PermissionResponse[]) {
    return permissions.reduce((acc, perm) => {
      const group = acc.find(g => g.resource === perm.resource);
      if (group) {
        group.actions.push(perm.action);
      } else {
        acc.push({
          resource: perm.resource,
          actions: [perm.action]
        });
      }
      return acc;
    }, [] as { resource: string, actions: string[] }[]);
  }
  
  isRoleSelected(roleId: number): boolean {
    const selectedRoles = this.userForm.get('roles')?.value || [];
    return selectedRoles.includes(roleId);
  }
  
  toggleRole(roleId: number) {
    const currentRoles = this.userForm.get('roles')?.value || [];
    if (this.isRoleSelected(roleId)) {
      this.userForm.patchValue({
        roles: currentRoles.filter((id: number) => id !== roleId)
      });
    } else {
      this.userForm.patchValue({
        roles: [...currentRoles, roleId]
      });
    }
  }
}
