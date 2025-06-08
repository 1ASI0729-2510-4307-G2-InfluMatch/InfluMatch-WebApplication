import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang = new BehaviorSubject<string>('es');

  constructor() {
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['es', 'en'].includes(savedLang)) {
      this.currentLang.next(savedLang);
    }
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }

  use(lang: string): void {
    if (['es', 'en'].includes(lang)) {
      this.currentLang.next(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  }
} 