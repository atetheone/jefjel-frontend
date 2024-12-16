import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MaterialModule } from '#shared/material/material.module';
import { UserService } from '#features/users/services/user.service';
import { RoleService } from '#services/role.service';
import { ToastService } from '#services/toast.service';
import { UserResponse } from '#types/user';
import { RoleResponse } from '#types/role';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule
  ],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  userForm!: FormGroup;
  userData: UserResponse | null = null;
  availableRoles: RoleResponse[] = [];
  userRoles: RoleResponse[] = [];
  roleCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredRoles: RoleResponse[] = [];

  @ViewChild('roleInput') roleInput!: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get user ID from route params
    const userId = this.route.snapshot.params['id'];
    this.userRoles = [];
    
    // Load roles
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.availableRoles = response.data;
        this.filteredRoles = response.data;
      },
      error: (error) => console.error('Error loading roles:', error)
    });

    // Load user data
    this.userService.getUser(userId).subscribe({
      next: (response) => {
        this.userData = response.data;
        this.userRoles = response.data.roles;
        this.initializeForm(response.data);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.router.navigate(['/admin/users']);
      }
    });


    // Filtering
    this.roleCtrl.valueChanges.pipe(
      startWith(null),
      map((roleInput: string | null) => 
        roleInput ? this._filter(roleInput) : this.availableRoles.slice()
      )
    ).subscribe(filteredRoles => {
      this.filteredRoles = filteredRoles;
    });
  }

  private initializeForm(user: UserResponse) {
    console.table(this.userRoles)

    this.userForm = this.fb.group({
      username: [{ value: user.username, disabled: true }],
      email: [{ value: user.email, disabled: true }],
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      status: [user.status, Validators.required],
      roles: [this.userRoles || [], Validators.required]
    });
  }

  // private _filter(value: string): RoleResponse[] {
  //   const filterValue = value.toLowerCase();
  //   return this.availableRoles.filter(role => role.name.toLowerCase().includes(filterValue));
  // }


  private _filter(value: string | RoleResponse | null): RoleResponse[] {
    // If value is null or undefined, return all roles
    if (!value) return this.availableRoles;
  
    // If value is a RoleResponse object, convert it to its name
    const filterValue = typeof value === 'string' 
      ? value.toLowerCase() 
      : value.name.toLowerCase();
  
    return this.availableRoles.filter(role => 
      role.name.toLowerCase().includes(filterValue)
    );
  }

  addRole(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const role = this.availableRoles.find(r => r.name === value.trim());
      if (role && !this.userRoles.includes(role)) {
        this.userRoles.push(role);
        this.userForm.get('roles')?.setValue(this.userRoles);
      }
    }

    if (input) {
      input.value = '';
    }

    this.roleCtrl.setValue(null);
  }

  removeRole(role: RoleResponse): void {
    const index = this.userRoles.findIndex(r => r.id === role.id);

    if (index >= 0) {
      this.userRoles.splice(index, 1);
      this.userForm.get('roles')?.setValue(this.userRoles);
    }
  }

  selectedRole(event: MatAutocompleteSelectedEvent): void {
    const selectedRole = event.option.value;

    if (!this.userRoles) {
      this.userRoles = [];
    }

    if (!this.userRoles.some(r => r.id === selectedRole.id)) {
      this.userRoles.push(selectedRole);
      this.userForm.get('roles')?.setValue(this.userRoles);
    }

    this.roleInput.nativeElement.value = '';
    this.roleCtrl.setValue(null);
  }

  onSubmit() {
    if (this.userForm.valid && this.userForm.dirty && this.userData) {
      const updatedUser = {
        ...this.userForm.getRawValue(),
        id: this.userData.id,
        roles: this.userRoles.map(role => role.id) // Convert role objects to IDs

      };

      console.table(updatedUser)

      this.userService.updateUser(this.userData.id, updatedUser).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard/users']);
          this.toastService.success(response.message)
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.error(error.message)
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users']);
  }
}