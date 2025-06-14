import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DashboardProfileVO } from '../../../../domain/value-objects/dashboard-profile.vo';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input() profile!: DashboardProfileVO;
  @Input() type: 'influencer' | 'brand' = 'influencer';

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/dashboard/profile', this.profile.userId]);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
