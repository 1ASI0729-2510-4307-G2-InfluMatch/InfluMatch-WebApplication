import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './infrastructure/auth/auth.interceptor';
import { routes } from './app.routes';
import { AuthRepository } from '@core/domain/auth/repositories/auth.repository';
import { AuthHttpRepository } from './infrastructure/auth/auth-http.repository';
import { ProfileRepository } from './core/domain/profile/repositories/profile.repository';
import { ProfileHttpRepository } from './infrastructure/profile/profile-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideAnimations(),
    {
      provide: AuthRepository,
      useClass: AuthHttpRepository
    },
    {
      provide: ProfileRepository,
      useClass: ProfileHttpRepository
    }
  ]
};
