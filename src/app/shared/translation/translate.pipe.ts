import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private value: string = '';
  private lastKey: string = '';
  private subscription?: Subscription;

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.subscription?.unsubscribe();
      this.subscription = this.translationService.currentLang$.subscribe(() => {
        const translated = this.translationService.translate(key);
        if (translated !== this.value) {
          this.value = translated;
        }
      });
    }
    return this.value || key;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
} 