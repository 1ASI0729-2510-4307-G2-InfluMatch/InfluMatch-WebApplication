import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { corsInterceptor } from './core/interceptors/cors.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { DashboardRepository } from './domain/repositories/dashboard-repository';
import { DashboardRepositoryImpl } from './infrastructure/repositories/dashboard.repository';

import { CalendarModule, DateAdapter, CalendarDateFormatter, CalendarAngularDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([corsInterceptor, authInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
        deps: [LOCALE_ID],
      }),
    ),
    {
      provide: CalendarDateFormatter,
      useClass: CalendarAngularDateFormatter,
    },
    {
      provide: DashboardRepository,
      useClass: DashboardRepositoryImpl,
    },
  ],
};