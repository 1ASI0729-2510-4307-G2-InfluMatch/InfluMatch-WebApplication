import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { CalendarModule, CalendarView, CalendarEvent } from 'angular-calendar';

import { AgendaItem } from '../../../domain/models/agenda.model';
import { GetAgendaItemsUseCase } from '../../../application/use-cases/get-agenda-items.usecase';
import { AgendaRepository } from '../../../domain/repositories/agenda.repository';
import { AgendaRepositoryImpl } from '../../../infrastructure/repositories/agenda.repository.impl';

import { addDays, addMonths, addWeeks, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, format, getDaysInMonth, getDay, startOfWeek as dateFnsStartOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
    CalendarModule,
  ],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  providers: [
    { provide: AgendaRepository, useClass: AgendaRepositoryImpl },
    GetAgendaItemsUseCase,
  ]
})
export class AgendaComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  agendaEvents: CalendarEvent[] = [];
  loading = true;
  error = false;
  
  // Native calendar properties
  currentDate = new Date();
  calendarDays: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(
    private getAgendaItemsUseCase: GetAgendaItemsUseCase,
    private router: Router,
    public snackBar: MatSnackBar,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAgendaItems();
    this.generateCalendarDays();
  }

  loadAgendaItems(): void {
    this.loading = true;
    this.error = false;
    this.getAgendaItemsUseCase.execute().subscribe({
      next: (items: AgendaItem[]) => {
        this.agendaEvents = items.map(item => {
          const eventDate = new Date(item.date);
          return {
            start: startOfDay(eventDate),
            end: endOfDay(eventDate),
            title: `${item.eventTitle} - ${item.counterpartName}`,
            color: { primary: '#4169e1', secondary: '#F0F0F0' },
            actions: [],
            allDay: true,
            meta: {
              collaborationId: item.collaborationId,
              description: item.description,
              location: item.location
            }
          };
        });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading agenda items:', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('AGENDA.ERROR_LOADING'),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  // Native calendar methods
  generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month, getDaysInMonth(new Date(year, month)));
    
    const startDate = dateFnsStartOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = new Date(lastDayOfMonth);
    
    this.calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.agendaEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  previousMonth(): void {
    this.currentDate = subMonths(this.currentDate, 1);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentDate = addMonths(this.currentDate, 1);
    this.generateCalendarDays();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendarDays();
  }

  formatDate(date: Date): string {
    return format(date, 'd', { locale: es });
  }

  formatMonthYear(date: Date): string {
    return format(date, 'MMMM yyyy', { locale: es });
  }

  // Angular Calendar methods (keeping for compatibility)
  setView(view: CalendarView) {
    this.view = view;
  }

  today() {
    this.viewDate = new Date();
  }

  next() {
    this.viewDate = addMonths(this.viewDate, 1);
    if (this.view === CalendarView.Week) {
      this.viewDate = addWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Day) {
      this.viewDate = addDays(this.viewDate, 1);
    }
  }

  previous() {
    this.viewDate = subMonths(this.viewDate, 1);
    if (this.view === CalendarView.Week) {
      this.viewDate = subWeeks(this.viewDate, 1);
    } else if (this.view === CalendarView.Day) {
      this.viewDate = subDays(this.viewDate, 1);
    }
  }

  eventClicked(event: any): void {
    if (event && event.meta && event.meta.collaborationId) {
      this.router.navigate(['/dashboard/collaborations', event.meta.collaborationId]);
    }
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  viewCollaborationDetails(collaborationId: number): void {
    this.router.navigate(['/dashboard/collaborations', collaborationId]);
  }
} 