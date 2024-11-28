import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'
import { MaterialModule } from '#shared/material/material.module'
import { SidenavComponent } from './sidenav/sidenav.component'
import { AuthService } from '#services/auth.service'

@Component({
  selector: 'app-admin-layout',
  imports: [MaterialModule, RouterOutlet, SidenavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.sass'
})
export class AdminLayoutComponent {
  @ViewChild(SidenavComponent) sidenavComponent!: SidenavComponent;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidenav() {
    this.sidenavComponent.toggle();
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
