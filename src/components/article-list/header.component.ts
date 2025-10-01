

import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ArticleCategory } from '../../models/article.model';
import { CategoryService } from '../../services/category.service';
import { ArticleService } from '../../services/article.service';

interface Category {
  id: ArticleCategory | 'semua';
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private categoryService: CategoryService = inject(CategoryService);
  private articleService = inject(ArticleService);
  // FIX: Explicitly type the injected Router to resolve a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);
  
  selectedCategory = this.categoryService.selectedCategory;

  // FIX: Replaced static, incorrect category list with a computed signal that dynamically and correctly loads categories from the ArticleService.
  categories = computed(() => {
    const dynamicCategories = this.articleService.uniqueCategories();
    return [
      { id: 'semua' as const, name: 'Semua' },
      ...dynamicCategories
    ];
  });

  onSelectCategory(category: ArticleCategory | 'semua') {
    this.categoryService.selectCategory(category);
    // If we are on the about page, clicking a category should take us home.
    if (this.router.url.startsWith('/about')) {
      this.router.navigate(['/']);
    }
  }

  onLogoClick() {
    this.onSelectCategory('semua');
  }
}
