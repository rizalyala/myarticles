import { Injectable, signal } from '@angular/core';
import { ArticleCategory } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly selectedCategory = signal<ArticleCategory | 'semua'>('semua');

  selectCategory(category: ArticleCategory | 'semua') {
    this.selectedCategory.set(category);
  }
}
