import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';

@Component({
  selector: 'app-verify-account',
  imports: [CommonModule, MaterialModule],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.sass'
})
export class VerifyAccountComponent implements OnInit {
  token$!: Observable<string>;
  token: string = '';
  isLoading = true;
  isVerified = false;
  isExpired = false;
  isResending = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.token$ = this.route.paramMap.pipe(
      map((params) => params.get('token')!)
    );
  }

  ngOnInit(): void {
    this.token$.subscribe({
      next: (token) => {
        if (!token) {
          this.router.navigate(['/login']);
          return;
        }
        this.token = token;
        this.verifyAccount();
      }
    });
  }

  verifyAccount() {
    this.isLoading = true;
    this.authService.verify(this.token).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isVerified = true;
        this.toastService.success(response.message);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 410) { // Gone - Token expired
          this.isExpired = true;
        } else {
          this.toastService.error(error.message);
          this.router.navigate(['/login']);
        }
      }
    });
  }

  resendVerification() {

  }
}
