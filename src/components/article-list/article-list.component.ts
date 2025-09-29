
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  templateUrl: './article-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent {
  articles = input.required<Article[]>();
  articleSelected = output<Article>();

  selectArticle(article: Article) {
    this.articleSelected.emit(article);
  }
}
