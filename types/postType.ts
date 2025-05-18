export interface Post {
  id: string;
  author: string;
  content: string;
  images?: string[];
  likesCount: number;
  likes: string[];
  commentsCount: number;
  comments: string[];
}