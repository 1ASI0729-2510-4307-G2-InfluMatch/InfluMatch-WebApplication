import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './infrastructure/auth/auth.interceptor';
import { routes } from './app.routes';
import { AuthRepository } from '@core/domain/auth/repositories/auth.repository';
import { AuthHttpRepository } from './infrastructure/auth/auth-http.repository';
import { ProfileRepository } from './core/domain/profile/repositories/profile.repository';
import { ProfileHttpRepository } from './infrastructure/profile/profile-http.repository';

// Import locales
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

// Register locales
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

// Function to get the current language from URL or default to 'es'
function getCurrentLanguage(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'es';
}

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
    },
    {
      provide: LOCALE_ID,
      useFactory: getCurrentLanguage
    }
  ]
};
