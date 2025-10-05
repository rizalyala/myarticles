import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private structuredDataScript: HTMLScriptElement | null = null;

  private readonly siteName = 'Lensa Tenggara';
  private readonly defaultDescription = 'Platform riset dan analisis mendalam mengenai inovasi, kreativitas, dan gaya hidup di Asia Tenggara.';
  private readonly defaultTitle = `${this.siteName} - Inovasi, Kreativitas & Gaya Hidup`;

  setHomeTags(): void {
    this.title.setTitle(this.defaultTitle);
    this.meta.updateTag({ name: 'description', content: this.defaultDescription });
    this.removeStructuredData();
  }

  setAboutTags(): void {
    const title = `Tentang Kami | ${this.siteName}`;
    const description = `Pelajari lebih lanjut tentang Lensa Tenggara, misi kami untuk menyajikan cerita inspiratif dan perspektif segar yang menyoroti masa depan kawasan Asia Tenggara yang dinamis.`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.removeStructuredData();
  }

  setArticleTags(article: Article): void {
    this.title.setTitle(`${article.title} | ${this.siteName}`);
    this.meta.updateTag({ name: 'description', content: article.summary.replace(/\s+/g, ' ').trim() });
    this.setArticleStructuredData(article);
  }

  private setArticleStructuredData(article: Article): void {
    this.removeStructuredData(); // Remove previous one first

    const data = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'image': [article.imageUrl],
      'datePublished': article.publicationDateISO,
      'author': [{
        '@type': 'Person',
        'name': article.author
      }],
      'publisher': {
        '@type': 'Organization',
        'name': 'Lensa Tenggara'
      },
      'description': article.summary.replace(/\s+/g, ' ').trim()
    };

    this.structuredDataScript = document.createElement('script');
    this.structuredDataScript.type = 'application/ld+json';
    this.structuredDataScript.textContent = JSON.stringify(data);
    document.head.appendChild(this.structuredDataScript);
  }

  private removeStructuredData(): void {
    if (this.structuredDataScript && this.structuredDataScript.parentNode) {
      this.structuredDataScript.parentNode.removeChild(this.structuredDataScript);
      this.structuredDataScript = null;
    }
  }
}