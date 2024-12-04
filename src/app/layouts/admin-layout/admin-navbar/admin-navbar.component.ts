import { Component, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.sass'
})
export class AdminNavbarComponent {
  toggleSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/']);
  }
}