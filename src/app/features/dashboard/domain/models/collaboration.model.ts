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
  initiatorRole: 'INFLUENCER' | 'BRAND';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  counterpartName: string;
  counterpartPhotoUrl: string;
  message: string;
  actionType: string;
  createdAt: string;
}

export interface CollaborationListResponse {
  collaborations: CollaborationListItem[];
} 