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
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'  | 'COMPLETED';
  message: string;
  createdAt: string;
  updatedAt: string;
} 