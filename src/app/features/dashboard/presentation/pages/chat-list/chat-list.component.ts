import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ChatService, Chat, Interlocutor } from '../../../application/services/chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  loading: boolean = false;
  error: string | null = null;
  chats: Chat[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.loading = true;
    this.error = null;
    
    this.chatService.listChats().subscribe({
      next: (data) => {
        this.chats = data;
        this.loading = false;
        if (this.chats.length === 0) {
          this.error = this.translate.instant('CHAT_LIST.NO_CHATS');
        }
      },
      error: (err) => {
        console.error('Error loading chats:', err);
        this.loading = false;
        this.error = this.translate.instant('CHAT_LIST.ERROR_LOADING_CHATS');
        this.snackBar.open(this.error ?? '', 'Close', { duration: 5000 });
      },
    });
  }

  openChat(chatId: number): void {
    // Navigate to the specific chat messages
    this.router.navigate(['/dashboard/chats', chatId]);
  }

  getInterlocutorAvatar(interlocutor: Interlocutor): string {
    // Use interlocutor.photoBase64 directly
    return interlocutor.photoBase64 ? `data:image/jpeg;base64,${interlocutor.photoBase64}` : 'assets/images/default-avatar.png';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
} 