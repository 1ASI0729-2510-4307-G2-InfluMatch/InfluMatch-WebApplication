export interface Milestone {
  title: string;
  date: string;
  description: string;
  location: string;
  deliverables: string;
}

export interface Collaboration {
  counterpartId: number;
  message: string;
  actionType: 'REEL_IG' | 'POST_IG' | 'STORY_IG' | 'VIDEO_YT' | 'TIKTOK' | 'BLOG_POST' | 'PODCAST' | 'EVENT';
  targetDate: string;
  budget: number;
  milestones: Milestone[];
  location: string;
  deliverables: string;
}

export interface CollaborationResponse {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationListItem {
  id: number;
  initiatorId: number;
  counterpartId: number;
  initiatorRole: 'INFLUENCER' | 'BRAND';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'FINISHED';
  counterpartName: string;
  counterpartPhotoUrl: string | null;
  message: string;
  actionType: string;
  createdAt: string;
}

export interface CollaborationListResponse {
  collaborations: CollaborationListItem[];
}

export interface CollaborationCounterpart {
  id: number;
  name: string;
  photoUrl: string | null;
}

export interface CollaborationDetail {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  initiatorRole: 'INFLUENCER' | 'BRAND';
  counterpart: CollaborationCounterpart;
  message: string;
  actionType: string;
  targetDate: string;
  budget: number;
  milestones: Milestone[];
  location: string;
  deliverables: string;
  createdAt: string;
  updatedAt: string;
} 