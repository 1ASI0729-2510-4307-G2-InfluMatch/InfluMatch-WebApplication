import { HttpInterceptorFn } from '@angular/common/http';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedRequest = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .set('Cache-Control', 'no-cache')
      .set('Connection', 'keep-alive'),
    withCredentials: true
  });

  return next(modifiedRequest);
}; 