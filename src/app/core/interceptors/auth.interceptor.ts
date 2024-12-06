import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '#env/environment'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authRequest)
  }

  return next(req);
};
