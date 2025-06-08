import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userInfo = localStorage.getItem('user');
  
  if (userInfo) {
    const user = JSON.parse(userInfo);
    if (user.token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${user.token}`)
      });
      return next(authReq);
    }
  }
  
  return next(req);
};
