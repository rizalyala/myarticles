export type ArticleCategory = 'ekonomi' | 'kesehatan' | 'teknologi';

export interface ArticleContent {
  pendahuluan: string[];
  metodologi: string[];
  hasilDanPembahasan: string[];
  kesimpulan: string[];
}

export interface Article {
  id: number;
  title: string;
  category: ArticleCategory;
  categoryDisplay: string;
  summary: string;
  content: ArticleContent;
  author: string;
  publicationDate: string;
  sources: string[];
  imageUrl: string;
}
