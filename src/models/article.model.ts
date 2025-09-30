export type ArticleCategory = 'ekonomi' | 'kesehatan' | 'teknologi';

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  categoryDisplay: string;
  summary: string;
  content: string; // Changed from ArticleContent to string
  author: string;
  publicationDate: string;
  imageUrl: string;
}
