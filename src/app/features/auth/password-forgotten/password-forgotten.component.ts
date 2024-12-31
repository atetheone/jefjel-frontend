// src/app/features/auth/password-forgotten/password-forgotten.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';

@Component({
  selector: 'app-password-forgotten',
  imports: [
    MaterialModule, 
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule
  ],
  templateUrl: './password-forgotten.component.html',
  styleUrl: './password-forgotten.component.sass'
})
export class PasswordForgottenComponent {
  resetForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const email = this.resetForm.get('email')?.value;

      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.resetForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isSubmitting = false;
        }
      });
    }
  }
}