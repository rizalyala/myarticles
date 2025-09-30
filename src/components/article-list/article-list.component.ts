import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  templateUrl: './article-list.component.html',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent {
  articles = input.required<Article[]>();
  articleSelected = output<Article>();

  selectArticle(article: Article) {
    this.articleSelected.emit(article);
  }
}
