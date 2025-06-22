import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          width: '250px',
        })
      ),
      state(
        'collapsed',
        style({
          width: '70px',
        })
      ),
      transition('expanded <=> collapsed', [
        animate('0.25s cubic-bezier(0.25, 1, 0.5, 1)'),
      ]),
    ]),
    trigger('fadeInOut', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateX(10px)',
          display: 'none',
        })
      ),
      transition('visible <=> hidden', [
        animate('0.2s cubic-bezier(0.25, 1, 0.5, 1)'),
      ]),
    ]),
    trigger('mobileMenuAnimation', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
        })
      ),
      transition('open <=> closed', [
        animate('0.3s cubic-bezier(0.25, 1, 0.5, 1)'),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  user: any = null;
  isExpanded = false;
  isMobile = false;
  isMobileMenuOpen = false;
  tooltipVisible = false;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;
  currentLang = 'es';
  dashboardTooltip = '';
  profileTooltip = '';
  messagesTooltip = '';
  campaignsTooltip = '';
  analyticsTooltip = '';
  settingsTooltip = '';
  logoutTooltip = '';
  languageTooltip = '';
  collaborationsTooltip = '';
  agendaTooltip = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.checkScreenSize();
    this.currentLang = this.translateService.currentLang || 'es';
    this.translateTooltips();

    this.translateService.onLangChange.subscribe(() => {
      this.translateTooltips();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Si no estamos en móvil y el sidebar está expandido
    if (!this.isMobile && this.isExpanded) {
      // Verificar si el clic fue fuera del sidebar
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isExpanded = false;
      }
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isExpanded = false;
    }
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.isExpanded = !this.isExpanded;
    } else {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }

  closeMobileMenu() {
    if (this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  showTooltip(event: MouseEvent, text: string) {
    if (!this.isExpanded) {
      this.tooltipText = text;
      this.tooltipX = event.clientX + 15;
      this.tooltipY = event.clientY;
      this.tooltipVisible = true;
    }
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translateService.use(this.currentLang);
  }

  logout(): void {
    // Limpiar todos los datos de sesión
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('profileType');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');

    // Notificar al servicio de autenticación
    this.authService.logout();

    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }

  translateTooltips(): void {
    this.translateService
      .get('SIDEBAR.DASHBOARD')
      .subscribe((text) => (this.dashboardTooltip = text));
    this.translateService
      .get('SIDEBAR.PROFILE')
      .subscribe((text) => (this.profileTooltip = text));
    this.translateService
      .get('SIDEBAR.MESSAGES')
      .subscribe((text) => (this.messagesTooltip = text));
    this.translateService
      .get('SIDEBAR.CAMPAIGNS')
      .subscribe((text) => (this.campaignsTooltip = text));
    this.translateService
      .get('SIDEBAR.AGENDA')
      .subscribe((text) => (this.agendaTooltip = text));
    this.translateService
      .get('SIDEBAR.SETTINGS')
      .subscribe((text) => (this.settingsTooltip = text));
    this.translateService
      .get('SIDEBAR.LOGOUT')
      .subscribe((text) => (this.logoutTooltip = text));
    this.translateService
      .get('Language')
      .subscribe((text) => (this.languageTooltip = text));
    this.translateService
      .get('SIDEBAR.COLLABORATIONS')
      .subscribe((text) => (this.collaborationsTooltip = text));
  }
}
