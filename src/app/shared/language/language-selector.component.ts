import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslationService } from '../services/translation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  currentLang$!: Observable<string>;

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.currentLang$ = this.translationService.currentLang$;
  }

  changeLanguage(lang: string) {
    this.translationService.setLanguage(lang).subscribe({
      error: (err) => console.error('Error changing language:', err)
    });
  }
} 