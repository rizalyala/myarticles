import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { SeoService } from '../../services/seo.service';
import { ArticleListComponent } from '../../components/article-list/article-list.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleListComponent, SkeletonLoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private seoService = inject(SeoService);

  articles = this.articleService.articles;
  loading = this.articleService.loading;
  error = this.articleService.error;
  
  selectedCategory = this.categoryService.selectedCategory;
  searchQuery = signal<string>('');
  isSearchVisible = signal<boolean>(false);

  hasContent = computed(() => this.articles().length > 0);

  constructor() {
    this.seoService.setHomeTags();
  }

  filteredArticles = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    let articles = this.articles();

    if (category !== 'semua') {
      articles = articles.filter(article => article.categoryDisplay === category);
    }

    if (query) {
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.summary.toLowerCase().includes(query)
      );
    }

    return articles;
  });

  onSearchChanged(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }

  openSearch(): void {
    this.isSearchVisible.set(true);
  }

  closeSearch(): void {
    this.isSearchVisible.set(false);
  }
}