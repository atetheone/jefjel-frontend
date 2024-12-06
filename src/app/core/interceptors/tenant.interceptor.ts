import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '#env/environment'

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenant = /*window.location.hostname.split('.')[0] ?? */environment.defaultTenant;

  console.log('Intercepting with tenant: ' + tenant);
  
  const tenantRequest = req.clone({
    setHeaders: {
      'X-Tenant-Slug': tenant,
    },
  })

  return next(tenantRequest);
};
