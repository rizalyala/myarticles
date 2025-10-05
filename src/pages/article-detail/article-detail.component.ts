import { Component, ChangeDetectionStrategy, inject, computed, signal, OnDestroy, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { SeoService } from '../../services/seo.service';
import { ArticleViewComponent } from '../../components/article-view/article-view.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [ArticleViewComponent],
  templateUrl: './article-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private seoService = inject(SeoService);
  private routeSub: Subscription;

  private articleId = signal<string | null>(null);
  
  loading = this.articleService.loading;
  
  article = computed(() => {
    const id = this.articleId();
    if (!id) return undefined;
    return this.articleService.articles().find(a => a.id === id);
  });
  
  articleNotFound = computed(() => !this.loading() && !this.article());

  constructor() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.articleId.set(params.get('id'));
      window.scrollTo(0, 0);
    });

    effect(() => {
      const currentArticle = this.article();
      if (currentArticle) {
        this.seoService.setArticleTags(currentArticle);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.seoService.setHomeTags(); // Reset tags when leaving article view
  }
}