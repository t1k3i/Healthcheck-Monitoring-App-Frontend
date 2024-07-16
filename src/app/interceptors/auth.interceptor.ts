import { HttpInterceptorFn } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { UrlinfoService } from '../services/urlinfo.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(AuthenticationService);
  const urservice = inject(UrlinfoService);

  const user = service.getCurrentUser();
  const isLoggedIn = user?.authdata;
  const isApiUrl = req.url.startsWith(urservice.apiServer);
  if (isLoggedIn && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${user.authdata}`
      }
    })
  }
  return next(req);
};
