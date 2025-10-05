import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ArticleDetailComponent } from '../pages/article-detail/article-detail.component';

export const appRoutes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'artikel/:id', component: ArticleDetailComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];