import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ArticleCategory } from '../../models/article.model';
import { CategoryService } from '../../services/category.service';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private categoryService = inject(CategoryService);
  private articleService = inject(ArticleService);
  private router = inject(Router);
  
  selectedCategory = this.categoryService.selectedCategory;
  isMobileMenuOpen = signal(false);

  categories = computed(() => {
    const dynamicCategories = this.articleService.uniqueCategories();
    return [
      { id: 'semua' as const, name: 'Semua' },
      ...dynamicCategories
    ];
  });

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  onSelectCategory(category: ArticleCategory | 'semua') {
    this.categoryService.selectCategory(category);
    this.isMobileMenuOpen.set(false);
    // If we are on the about page, clicking a category should take us home.
    if (this.router.url.startsWith('/about')) {
      this.router.navigate(['/']);
    }
  }

  onLogoClick() {
    this.onSelectCategory('semua');
  }
}