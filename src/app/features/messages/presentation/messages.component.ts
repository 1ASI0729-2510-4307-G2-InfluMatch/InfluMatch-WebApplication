import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslatePipe } from '@shared/translation/translate.pipe';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TranslatePipe
  ],
  template: `
    <div class="messages-container">
      <h1>{{ 'messages.title' | translate }}</h1>
      <p>{{ 'messages.description' | translate }}</p>

      <!-- Placeholder content -->
      <mat-card>
        <mat-card-content>
          <p>{{ 'messages.comingSoon' | translate }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .messages-container {
      padding: 20px;

      h1 {
        margin-bottom: 16px;
        color: #333;
      }

      p {
        margin-bottom: 24px;
        color: #666;
      }

      mat-card {
        max-width: 800px;
        margin: 0 auto;
        padding: 24px;
      }
    }
  `]
})
export class MessagesComponent {} 