import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Get the current language from URL or default to 'es'
const params = new URLSearchParams(window.location.search);
const lang = params.get('lang') || 'es';

// Load the appropriate translation bundle
const translationBundle = lang === 'es' ? 'es' : 'en';

// Bootstrap the application with the correct locale
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
