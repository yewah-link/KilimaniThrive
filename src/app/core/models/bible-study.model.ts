import { Tag } from './tag.model';

export type StudyStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BibleStudy {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  contentUrl?: string;
  imageUrl?: string;
  slug?: string;
  category?: string;
  status?: StudyStatus;
  views?: number;
  likes?: number;
  authorId?: number;
  authorName?: string;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
}
