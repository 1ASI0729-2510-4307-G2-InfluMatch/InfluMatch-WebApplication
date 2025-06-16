import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; // Import environment

// New interface for Interlocutor
export interface Interlocutor {
  id: number;
  name: string;
  photoBase64: string | null;
}

// New interface for Last Message Summary in Chat list
export interface LastMessageSummary {
  content: string;
  createdAt: string; // ISO 8601 string
}

// Define interfaces for Chat and Message based on your API structure
export interface Chat {
  chatId: number;
  interlocutorId: number; // Keep this for now, may be useful for routing/direct messaging
  interlocutor: Interlocutor;
  lastMessage?: LastMessageSummary; // Use the new summary interface
  unreadCount: number;
}

export interface Message {
  messageId: number;
  senderId: number;
  receiverId: number;
  chatId: number;
  content: string;
  createdAt: string; // Renamed from timestamp to createdAt
  status?: 'sent' | 'delivered' | 'read'; // Optional as it's not always in GET /messages
  type?: 'text' | 'photo' | 'video' | 'document'; // Optional as it's not always in GET /messages
  attachmentUrl?: string; // URL for attachment after upload
}

// Interface for the response from GET /api/chats/{userId}/messages
export interface ChatMessagesResponse {
  interlocutor: {
    userId: number;
    name: string;
    photoBase64: string;
  };
  messages: {
    messageId: number;
    content: string;
    attachmentUrl: string | null;
    createdAt: string;
    isFromMe: boolean;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of chat conversations for the current user.
   * Corresponds to GET /api/chats
   */
  listChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`);
  }

  /**
   * Sends a message to a specific receiver.
   * Corresponds to POST /api/chats/messages/{receiverId}
   * @param receiverId The ID of the recipient user.
   * @param content The message content.
   * @param attachmentBase64 Optional attachment content (Base64).
   * @param attachmentType Optional attachment type (PHOTO, VIDEO, DOCUMENT).
   */
  sendMessage(
    receiverId: number,
    content: string,
    attachmentBase64?: string,
    attachmentType?: 'PHOTO' | 'VIDEO' | 'DOCUMENT'
  ): Observable<Message> {
    const body: any = { content };
    if (attachmentBase64 && attachmentType) {
      body.attachmentBase64 = attachmentBase64; // Changed to attachmentBase64
      body.attachmentType = attachmentType;
    }
    return this.http.post<Message>(
      `${this.apiUrl}/chats/messages/${receiverId}`,
      body
    );
  }

  /**
   * Fetches all messages for a specific chat conversation with interlocutor info.
   * Corresponds to GET /api/chats/{userId}/messages
   * @param userId The ID of the user to get messages with.
   */
  getChatWithMessages(userId: number): Observable<ChatMessagesResponse> {
    return this.http.get<ChatMessagesResponse>(`${this.apiUrl}/chats/${userId}/messages`);
  }

  /**
   * Fetches all messages for a specific chat conversation.
   * Corresponds to GET /api/chats/{chatId}/messages
   * @param chatId The ID of the chat conversation.
   */
  getMessages(chatId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages`);
  }
} 