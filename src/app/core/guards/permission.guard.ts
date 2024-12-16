import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '#services/auth.service';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasPermissions(requiredPermissions)) {
      return true;
    }

    // Redirect to dashboard or show access denied
    router.navigate(['/dashboard']);
    return false;
  };
};