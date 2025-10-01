import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly selectedCategory = signal<string>('semua');

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}