import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-view',
  standalone: true,
  imports: [],
  templateUrl: './article-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleViewComponent {
  article = input.required<Article>();
  backToList = output<void>();

  onBack() {
    this.backToList.emit();
  }
}