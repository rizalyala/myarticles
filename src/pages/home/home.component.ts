
import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { ArticleListComponent } from '../../components/article-list/article-list.component';
import { ArticleViewComponent } from '../../components/article-view/article-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleListComponent, ArticleViewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);

  allArticles = this.articleService.getArticles();
  
  selectedCategory = this.categoryService.selectedCategory;
  selectedArticle = signal<Article | null>(null);
  searchQuery = signal<string>('');
  isSearchVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      // React to category changes by returning to the article list view.
      this.selectedCategory(); // Dependency
      this.selectedArticle.set(null);
    }, { allowSignalWrites: true });
  }

  filteredArticles = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    let articles = this.allArticles();

    if (category !== 'semua') {
      articles = articles.filter(article => article.category === category);
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

  onArticleSelect(article: Article): void {
    this.selectedArticle.set(article);
    window.scrollTo(0, 0);
  }

  onBackToList(): void {
    this.selectedArticle.set(null);
  }

  openSearch(): void {
    this.isSearchVisible.set(true);
    this.selectedArticle.set(null); // Ensure we are on the list view
  }

  closeSearch(): void {
    this.isSearchVisible.set(false);
  }
}
