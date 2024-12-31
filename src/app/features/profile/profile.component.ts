import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';

import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';
import { UserService } from '#features/users/services/user.service';
import { UserResponse } from '#types/user';


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.sass'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  user: UserResponse | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Subscribe to user changes
    this.authService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        // console
        if (user) {
          this.user = user;
          this.loadUserData();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}]
    });
  }

  loadUserData() {

    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const { firstName, lastName } = this.profileForm.getRawValue();
      
      // Assuming authService has an update method
      this.userService.updateUserProfile({ firstName, lastName })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // Update stored user data
            const updatedUser = {
              ...this.user,
              firstName,
              lastName
            };
            
            // Update the user in AuthService
            this.authService.userSubject.next(updatedUser);
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
          
            this.toastService.success(response.message)//'Profile updated successfully')
          },
          error: (error) => {
            this.toastService.error('Failed to update profile');
            console.error('Profile update error', error);
          }
        });
        
    }
  }

  resetForm() {
    this.loadUserData();
  }
}