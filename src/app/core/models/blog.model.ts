import { Tag } from './tag.model';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Blog {
  id?: number;
  title: string;
  slug?: string;
  content: string;
  featuredImage?: string;
  status?: BlogStatus;
  featured?: boolean;
  allowComments?: boolean;
  views?: number;
  likes?: number;
  authorId?: number;
  authorName?: string;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
}
