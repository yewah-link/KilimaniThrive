export interface Comment {
  id?: number;
  content: string;
  authorName?: string;
  authorEmail?: string;
  authorInitial?: string;
  blogId: number;
  parentId?: number;
  createdAt?: string;
}
