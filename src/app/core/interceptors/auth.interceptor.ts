import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  console.log('🔍 Interceptor called for URL:', request.url);
  
  // Solo excluir exactamente las rutas de autenticación
  const authPaths = [
    '/api/auth/login',
    '/api/auth/register'
  ];

  // Crear un objeto URL para analizar la ruta
  const url = new URL(request.url);
  // Obtener el pathname de la URL
  const pathname = url.pathname;
  
  // Verificar si el pathname coincide con alguna de las rutas de autenticación
  const isAuthRoute = authPaths.some(path => pathname === path);
  console.log('🔐 Is auth route?', isAuthRoute, 'Pathname:', pathname);

  // Si NO es una ruta de autenticación, intentamos agregar el token
  if (!isAuthRoute) {
    const token = localStorage.getItem('token');
    console.log('🎫 Token found:', !!token);
    
    if (token) {
      console.log('📝 Adding token to request headers');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Verificar que el header se agregó correctamente
      console.log('✅ Final request headers:', request.headers.get('Authorization'));
    } else {
      console.log('⚠️ No token available for non-auth route');
    }
  } else {
    console.log('🚫 Skipping token for auth route');
  }
  
  return next(request);
}; 