import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface Translations {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = new BehaviorSubject<Translations>({});
  private currentLangSubject = new BehaviorSubject<string>('es');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeTranslations();
  }

  private async initializeTranslations() {
    const savedLang = localStorage.getItem('language') || 'es';
    try {
      const translations = await firstValueFrom(
        this.http.get<Translations>(`/assets/i18n/${savedLang}.json`)
      );
      this.translations.next(translations);
      this.currentLangSubject.next(savedLang);
    } catch (error) {
      console.error('Error loading initial translations:', error);
    }
  }

  setLanguage(lang: string): Observable<Translations> {
    return this.http.get<Translations>(`/assets/i18n/${lang}.json`).pipe(
      tap(translations => {
        this.translations.next(translations);
        this.currentLangSubject.next(lang);
        localStorage.setItem('language', lang);
      }),
      catchError(error => {
        console.error(`Error loading translations for ${lang}:`, error);
        throw error;
      })
    );
  }

  translate(key: string): string {
    const translations = this.translations.getValue();
    if (!translations) return key;

    const value = this.getNestedValue(translations, key);
    return value || key;
  }

  private getNestedValue(obj: any, path: string): string {
    try {
      return path.split('.').reduce((prev, curr) => {
        if (!prev) return '';
        return prev[curr];
      }, obj);
    } catch (e) {
      console.error(`Error accessing translation key: ${path}`, e);
      return '';
    }
  }
} 