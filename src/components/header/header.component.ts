
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ArticleCategory } from '../../models/article.model';
import { CategoryService } from '../../services/category.service';

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
  private categoryService = inject(CategoryService);
  // FIX: Explicitly type the injected Router to resolve a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);
  
  selectedCategory = this.categoryService.selectedCategory;

  categories: Category[] = [
    { id: 'semua', name: 'Semua' },
    { id: 'ekonomi', name: 'Ekonomi' },
    { id: 'kesehatan', name: 'Kesehatan' },
    { id: 'teknologi', name: 'Teknologi' },
  ];

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
