import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-set-password',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.sass'
})
export class SetPasswordComponent implements OnInit {
  token$!: Observable<string>;
  token!: string; 
  setPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.setPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.token$ = this.route.params.pipe(
      map((params) => params['token'])
    );
  }

  ngOnInit(): void {
    this.token$.subscribe({
      next: (tok) => {
        console.log(`Token: ${tok}`);
        this.token = tok;
      }
    })
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    const { password } = this.setPasswordForm.value;
    this.authService.resetPassword(this.token, password)
      .subscribe(
        (response) => {
          // Password reset successful
          console.log('Password reset successful:', response);
          this.router.navigate(['/login']); // Redirect to login after success
        },
        (error) => {
          // Handle error
          // this.errorMessage = 'Password reset failed. Please try again.';
          console.error('Password reset error:', error); 
        }
      );
  }

}
