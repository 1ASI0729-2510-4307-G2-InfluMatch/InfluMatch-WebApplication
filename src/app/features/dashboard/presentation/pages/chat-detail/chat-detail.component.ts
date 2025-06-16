import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ChatService, Chat, Message, Interlocutor, ChatMessagesResponse } from '../../../application/services/chat.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { ProfileService } from '../../../infrastructure/services/profile.service';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslateModule,
    FormsModule,
  ],
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit, OnDestroy {
  currentChatId: number | null = null;
  targetInterlocutorId!: number;
  chat: Chat | undefined;
  interlocutorInfo: Interlocutor | undefined;
  messages: Message[] = [];
  newMessageContent: string = '';
  loadingInitialData: boolean = true;
  loadingMessages: boolean = false;
  sendingMessage: boolean = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('chatId');
      if (id) {
        this.targetInterlocutorId = +id;
        this.initializeChatFlow();
      } else {
        this.router.navigate(['/dashboard/chats']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeChatFlow(): void {
    this.loadingInitialData = true;
    this.error = null;

    this.chatService.getChatWithMessages(this.targetInterlocutorId).pipe(
      takeUntil(this.destroy$),
      catchError(err => {
        console.error('Error loading chat with messages:', err);
        this.error = this.translate.instant('CHAT_DETAIL.ERROR_LOADING_INITIAL_DATA');
        this.loadingInitialData = false;
        this.snackBar.open(this.error ?? '', 'Close', { duration: 5000 });
        return of(null);
      })
    ).subscribe((response: ChatMessagesResponse | null) => {
      if (response) {
        this.interlocutorInfo = {
          id: response.interlocutor.userId,
          name: response.interlocutor.name,
          photoBase64: response.interlocutor.photoBase64
        };

        this.messages = response.messages.map(msg => ({
          messageId: msg.messageId,
          content: msg.content,
          createdAt: msg.createdAt,
          senderId: msg.isFromMe ? (this.currentUserId || 0) : response.interlocutor.userId,
          receiverId: msg.isFromMe ? response.interlocutor.userId : (this.currentUserId || 0),
          chatId: 0,
          attachmentUrl: msg.attachmentUrl || undefined
        }));

        if (response.messages.length > 0) {
          this.chatService.listChats().pipe(
            takeUntil(this.destroy$),
            catchError(err => {
              console.error('Error listing chats:', err);
              return of([]);
            })
          ).subscribe(chats => {
            const existingChat = chats.find(c => c.interlocutor.id === this.targetInterlocutorId);
            if (existingChat) {
              this.chat = existingChat;
              this.currentChatId = existingChat.chatId;
            }
          });
        }
      } else {
        this.profileService.getProfileById(this.targetInterlocutorId).pipe(
          takeUntil(this.destroy$),
          catchError(err => {
            console.error('Error fetching interlocutor profile:', err);
            this.error = this.translate.instant('CHAT_DETAIL.ERROR_FETCHING_INTERLOCUTOR');
            this.snackBar.open(this.error ?? '', 'Close', { duration: 5000 });
            this.interlocutorInfo = { 
              id: this.targetInterlocutorId, 
              name: this.translate.instant('CHAT_DETAIL.UNKNOWN_USER'), 
              photoBase64: null 
            };
            return of(null);
          })
        ).subscribe(profile => {
          if (profile) {
            this.interlocutorInfo = {
              id: profile.id,
              name: profile.name,
              photoBase64: profile.profilePhoto || null
            };
          } else if (!this.interlocutorInfo) {
            this.interlocutorInfo = { 
              id: this.targetInterlocutorId, 
              name: this.translate.instant('CHAT_DETAIL.UNKNOWN_USER'), 
              photoBase64: null 
            };
          }
        });
      }
      
      this.loadingInitialData = false;
    });
  }

  loadMessages(): void {
    if (this.currentChatId === null) {
      console.warn('Cannot load messages: No current chat ID.');
      this.messages = [];
      this.loadingMessages = false;
      return; 
    }

    this.loadingMessages = true;
    this.error = null;
    this.chatService.getMessages(this.currentChatId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.messages = data;
        this.loadingMessages = false;
        this.loadingInitialData = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loadingMessages = false;
        this.error = this.translate.instant('CHAT_DETAIL.ERROR_LOADING_MESSAGES');
        this.snackBar.open(this.error ?? '', 'Close', { duration: 5000 });
        this.loadingInitialData = false;
      },
    });
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || (!this.currentChatId && !this.targetInterlocutorId)) {
      return;
    }

    this.sendingMessage = true;
    this.error = null;

    let receiverId: number;
    if (this.currentChatId) {
        receiverId = this.chat?.interlocutor.id || this.targetInterlocutorId;
    } else {
        receiverId = this.targetInterlocutorId;
    }

    this.chatService.sendMessage(receiverId, this.newMessageContent.trim()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (messageResponse) => {
        if (messageResponse && messageResponse.chatId) {
          if (this.currentChatId === null) {
            this.currentChatId = messageResponse.chatId;
            this.chat = { 
                chatId: messageResponse.chatId,
                interlocutorId: receiverId,
                interlocutor: this.interlocutorInfo || { id: receiverId, name: 'Unknown', photoBase64: null },
                unreadCount: 0,
                lastMessage: { content: messageResponse.content, createdAt: messageResponse.createdAt }
            };
          }
          this.messages.push(messageResponse);
          this.newMessageContent = '';
          this.sendingMessage = false;
        } else {
          console.error('Message sent but no chatId received in response.');
          this.snackBar.open(this.translate.instant('CHAT_DETAIL.ERROR_SENDING_MESSAGE'), 'Close', { duration: 5000 });
          this.sendingMessage = false;
        }
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.sendingMessage = false;
        this.error = this.translate.instant('CHAT_DETAIL.ERROR_SENDING_MESSAGE');
        this.snackBar.open(this.error ?? '', 'Close', { duration: 5000 });
      },
    });
  }

  getMessageAlignment(message: Message): string {
    if (message.senderId) {
      return message.senderId === this.currentUserId ? 'end' : 'start';
    }
    
    return 'start';
  }

  getInterlocutorAvatar(interlocutor: Interlocutor | undefined): string {
    if (!interlocutor) {
      return 'assets/images/default-avatar.png';
    }
    return interlocutor.photoBase64 ? `data:image/jpeg;base64,${interlocutor.photoBase64}` : 'assets/images/default-avatar.png';
  }
} 