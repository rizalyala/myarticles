export type ArticleCategory = 'inovasi' | 'budaya' | 'gaya-hidup';

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