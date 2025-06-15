export interface MilestoneDTO {
  title: string;
  date: string;
  description: string;
  location: string;
  deliverables: string;
}

export interface CollaborationDTO {
  counterpartId: number;
  message: string;
  actionType: 'REEL_IG' | 'POST_IG' | 'STORY_IG' | 'VIDEO_YT' | 'TIKTOK' | 'BLOG_POST' | 'PODCAST' | 'EVENT';
  targetDate: string;
  budget: number;
  milestones: MilestoneDTO[];
  location: string;
  deliverables: string;
}

export interface CollaborationResponseDTO {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  message: string;
  createdAt: string;
  updatedAt: string;
} 