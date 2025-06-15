import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileDetailsComponent } from './presentation/pages/profile-details/profile-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollaborationRepositoryImpl } from './infrastructure/repositories/collaboration.repository';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DashboardComponent,
    ProfileCardComponent,
    ProfileDetailsComponent
  ],
  providers: [
    CollaborationRepositoryImpl
  ]
})
export class DashboardModule { } 