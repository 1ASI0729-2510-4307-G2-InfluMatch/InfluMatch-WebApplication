import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateCollaborationUseCase } from '../../../application/use-cases/create-collaboration.usecase';
import { Collaboration, Milestone } from '../../../domain/models/collaboration.model';

@Component({
  selector: 'app-collaborations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    TranslateModule
  ],
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.scss']
})
export class CollaborationsComponent implements OnInit {
  collaborationForm!: FormGroup;
  loading = false;
  counterpartId: number | null = null;
  counterpartName: string = '';

  actionTypes: { value: string; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createCollaborationUseCase: CreateCollaborationUseCase,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initActionTypes();
    this.initForm();
    this.getCounterpartInfo();
  }

  private initActionTypes(): void {
    this.actionTypes = [
      { value: 'REEL_IG', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.REEL_IG') },
      { value: 'POST_IG', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.POST_IG') },
      { value: 'STORY_IG', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.STORY_IG') },
      { value: 'VIDEO_YT', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.VIDEO_YT') },
      { value: 'TIKTOK', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.TIKTOK') },
      { value: 'BLOG_POST', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.BLOG_POST') },
      { value: 'PODCAST', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.PODCAST') },
      { value: 'EVENT', label: this.translate.instant('COLLABORATIONS.ACTION_TYPES.EVENT') }
    ];
  }

  private initForm(): void {
    this.collaborationForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(50)]],
      actionType: ['', Validators.required],
      targetDate: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      deliverables: ['', Validators.required],
      milestones: this.fb.array([])
    });

    // Agregar al menos un milestone por defecto
    this.addMilestone();
  }

  private getCounterpartInfo(): void {
    this.counterpartId = Number(this.route.snapshot.queryParams['counterpartId']);
    this.counterpartName = this.route.snapshot.queryParams['counterpartName'] || this.translate.instant('COLLABORATIONS.DEFAULT_USER');
    
    if (!this.counterpartId) {
      this.snackBar.open(this.translate.instant('COLLABORATIONS.ERROR_NO_USER'), this.translate.instant('LOGIN.CLOSE'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/dashboard']);
    }
  }

  get milestones(): FormArray {
    return this.collaborationForm.get('milestones') as FormArray;
  }

  addMilestone(): void {
    const milestone = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      deliverables: ['', Validators.required]
    });

    this.milestones.push(milestone);
  }

  removeMilestone(index: number): void {
    if (this.milestones.length > 1) {
      this.milestones.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.collaborationForm.valid && this.counterpartId) {
      this.loading = true;
      
      const formValue = this.collaborationForm.value;
      
      // Formatear las fechas de los milestones
      const formattedMilestones = formValue.milestones.map((milestone: any) => ({
        ...milestone,
        date: this.formatDate(milestone.date)
      }));
      
      const collaboration: Collaboration = {
        counterpartId: this.counterpartId,
        message: formValue.message,
        actionType: formValue.actionType,
        targetDate: this.formatDate(formValue.targetDate),
        budget: formValue.budget,
        milestones: formattedMilestones,
        location: formValue.location,
        deliverables: formValue.deliverables
      };

      this.createCollaborationUseCase.execute(collaboration).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open(this.translate.instant('COLLABORATIONS.SUCCESS'), this.translate.instant('LOGIN.CLOSE'), {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard/collaborations']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear colaboración:', error);
          this.snackBar.open(this.translate.instant('COLLABORATIONS.ERROR'), this.translate.instant('LOGIN.CLOSE'), {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Si es un string ISO, crear un objeto Date
      dateObj = new Date(date);
    } else {
      // Si ya es un Date, usarlo directamente
      dateObj = date;
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.collaborationForm.controls).forEach(key => {
      const control = this.collaborationForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/collaborations']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.collaborationForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor a 0';
    }
    return '';
  }
} 