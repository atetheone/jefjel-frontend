import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#services/auth.service'


@Component({
  selector: 'app-navbar',
  imports: [MaterialModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass',
})
export class NavbarComponent implements OnInit {
  cartItemCount = signal(3);
  isLoggedIn: boolean = false;
  isUserMenuOpen = false;
  isCategoryMenuOpen = false;
  isAuthenticated = false;

  mainNavItems = [
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/deals', label: 'Deals' },
  ];

  userMenuItems = [
    { icon: 'person', label: 'My Profile', path: '/profile' },
    { icon: 'shopping_bag', label: 'My Orders', path: '/orders' },
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'favorite', label: 'Wishlist', path: '/wishlist' },
    { icon: 'settings', label: 'Settings', path: '/settings' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((state) => {
      this.isAuthenticated = state;
    })
  }

  logout(): void {
    this.authService.logout();
  }


  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

}