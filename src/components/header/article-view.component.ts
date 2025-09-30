
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-view',
  standalone: true,
  imports: [NgOptimizedImage],
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