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
