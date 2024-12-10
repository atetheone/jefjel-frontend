import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router'
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#services/auth.service'
import { SidenavComponent } from './sidenav/sidenav.component'
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component'
import { BreadcrumbComponent } from '#shared/components/breadcrumb/breadcrumb.component'


@Component({
  selector: 'app-admin-layout',
  imports: [
    MaterialModule, 
    RouterOutlet, 
    AdminNavbarComponent, 
    SidenavComponent,
    BreadcrumbComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.sass'
})
export class AdminLayoutComponent {
  isExpanded = signal<boolean>(true);
  sidenavWidth = computed(() => !this.isExpanded() ? '65px' : '250px');


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleSidenav() {
    this.isExpanded.set(!this.isExpanded());
  }

  
}