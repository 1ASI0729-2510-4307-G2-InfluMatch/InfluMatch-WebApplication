// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Import date adapter providers for angular-calendar
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { CalendarDateFormatter, CalendarAngularDateFormatter } from 'angular-calendar';

import { routes } from './app/app.routes'; // <-- tu archivo de rutas stand-alone
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

// 🔧 Factory para ngx-translate
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    // 👉 Router stand-alone
    provideRouter(routes),

    // 👉 Animaciones (equivalente a BrowserAnimationsModule)
    provideAnimations(),

    // 👉 HTTP Client with interceptors
    provideHttpClient(withInterceptors([authInterceptor])),

    // 👉 Date adapter providers for angular-calendar
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: CalendarDateFormatter, useClass: CalendarAngularDateFormatter },

    // 👉 Imports de módulos "clásicos" que aún necesitas
    importProvidersFrom(
      CoreModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
        defaultLanguage: 'es',
      })
    ),
  ],
}).catch((err) => console.error(err));
