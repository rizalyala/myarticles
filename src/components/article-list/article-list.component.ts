import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Article, ArticleCategory } from '../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  templateUrl: './article-list.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent {
  articles = input.required<Article[]>();
  articleSelected = output<Article>();

  selectArticle(article: Article) {
    this.articleSelected.emit(article);
  }

  getCategoryClass(category: ArticleCategory): string {
    switch (category) {
      case 'teknologi':
        return 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-200';
      case 'kesehatan':
        return 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200';
      case 'ekonomi':
        return 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
    }
  }
}