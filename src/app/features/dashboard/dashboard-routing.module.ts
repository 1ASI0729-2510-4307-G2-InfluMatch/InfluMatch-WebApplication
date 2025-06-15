import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileDetailsComponent } from './presentation/pages/profile-details/profile-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile/:id',
        component: ProfileDetailsComponent
      },
      {
        path: 'collaborations',
        loadComponent: () => import('./presentation/pages/collaborations-list/collaborations-list.component').then(m => m.CollaborationsListComponent)
      },
      {
        path: 'collaborations/:id',
        loadComponent: () => import('./presentation/pages/collaboration-details/collaboration-details.component').then(m => m.CollaborationDetailsComponent)
      },
      {
        path: 'new-collaboration',
        loadComponent: () => import('./presentation/pages/collaborations/collaborations.component').then(m => m.CollaborationsComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 