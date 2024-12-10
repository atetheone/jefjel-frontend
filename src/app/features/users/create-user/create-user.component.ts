import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { UserService } from '#features/users/services/user.service';
import { RoleService } from '#services/role.service';
import { RoleResponse } from '#types/role';


@Component({
  selector: 'app-create-user',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.sass'
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  availableRoles: RoleResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles: [[], Validators.required]
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
          this.router.navigate(['/admin/users']);
        },
        error: (error) => console.error('Error creating user:', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
