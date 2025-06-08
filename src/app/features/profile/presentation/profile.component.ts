import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslatePipe } from '@shared/translation/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TranslatePipe
  ],
  template: `
    <div class="profile-container">
      <h1>{{ 'profile.title' | translate }}</h1>
      <p>{{ 'profile.description' | translate }}</p>

      <!-- Placeholder content -->
      <mat-card>
        <mat-card-content>
          <p>{{ 'profile.comingSoon' | translate }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
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
export class ProfileComponent {} 