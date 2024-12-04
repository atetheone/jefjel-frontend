import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login attempted with:', { email, password });
      // Handle login logic here
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Login error:', error);
          // Toaster notification
        }
      });
      
    } else {
      console.log('Form is invalid');
    }
  }
}
