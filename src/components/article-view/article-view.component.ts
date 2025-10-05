import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Article, ArticleCategory } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-view',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './article-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleViewComponent {
  article = input.required<Article>();

  private articleService = inject(ArticleService);

  relatedArticles = computed(() => {
    const currentArticle = this.article();
    if (!currentArticle) {
      return [];
    }
    return this.articleService.articles()
      .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
      .slice(0, 3);
  });
  
  getCategoryClass(category: ArticleCategory): string {
    switch (category) {
      case 'inovasi':
        return 'bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-600/20';
      case 'budaya':
        return 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-600/20';
      case 'gaya-hidup':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-600/20';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20';
    }
  }
}
