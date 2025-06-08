import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslatePipe } from '@shared/translation/translate.pipe';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TranslatePipe
  ],
  template: `
    <div class="campaigns-container">
      <h1>{{ 'campaigns.title' | translate }}</h1>
      <p>{{ 'campaigns.description' | translate }}</p>

      <!-- Placeholder content -->
      <mat-card>
        <mat-card-content>
          <p>{{ 'campaigns.comingSoon' | translate }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .campaigns-container {
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
export class CampaignsComponent {} 