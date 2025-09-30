
import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { ArticleListComponent } from '../../components/article-list/article-list.component';
import { ArticleViewComponent } from '../../components/article-view/article-view.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleListComponent, ArticleViewComponent, SkeletonLoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private articleService: ArticleService = inject(ArticleService);
  private categoryService: CategoryService = inject(CategoryService);
  private titleService: Title = inject(Title);

  articles = this.articleService.articles;
  loading = this.articleService.loading;
  error = this.articleService.error;
  
  selectedCategory = this.categoryService.selectedCategory;
  selectedArticle = signal<Article | null>(null);
  searchQuery = signal<string>('');
  isSearchVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      // React to category changes by returning to the article list view.
      this.selectedCategory(); // Dependency
      this.selectedArticle.set(null);
    });

    effect(() => {
      const article = this.selectedArticle();
      if (article) {
        this.titleService.setTitle(`${article.title} | Lensa Tenggara`);
      } else {
        this.titleService.setTitle('Lensa Tenggara - Riset Ekonomi, Kesehatan, dan Teknologi');
      }
    });
  }

  filteredArticles = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    let articles = this.articles();

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
