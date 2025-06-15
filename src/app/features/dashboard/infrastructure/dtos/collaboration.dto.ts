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
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollaborationDto {
  counterpartId: number;
  message: string;
  actionType: 'REEL_IG' | 'POST_IG' | 'STORY_IG' | 'VIDEO_YT' | 'TIKTOK' | 'BLOG_POST' | 'PODCAST' | 'EVENT';
  targetDate: string;
  budget: number;
  milestones: MilestoneDto[];
  location: string;
  deliverables: string;
}

export interface MilestoneDto {
  title: string;
  date: string;
  description: string;
  location: string;
  deliverables: string;
}

export interface CollaborationListItemDto {
  id: number;
  initiatorRole: 'INFLUENCER' | 'BRAND';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  counterpartName: string;
  counterpartPhotoUrl: string | null;
  message: string;
  actionType: string;
  createdAt: string;
}

export interface CollaborationListResponseDto {
  collaborations: CollaborationListItemDto[];
}

export interface CollaborationCounterpartDto {
  id: number;
  name: string;
  photoUrl: string | null;
}

export interface CollaborationDetailDto {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FINISHED';
  initiatorRole: 'INFLUENCER' | 'BRAND';
  counterpart: CollaborationCounterpartDto;
  message: string;
  actionType: string;
  targetDate: string;
  budget: number;
  milestones: MilestoneDto[];
  location: string;
  deliverables: string;
  createdAt: string;
  updatedAt: string;
} 