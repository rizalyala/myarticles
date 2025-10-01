import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap, from } from 'rxjs';
import { Article, ArticleCategory } from '../models/article.model';
import { environment } from '../environments/environment';
import { GoogleGenAI } from '@google/genai';

// Interface for the raw Blogger API response
interface BloggerApiResponse {
  items: BloggerPost[];
}

interface BloggerPost {
  id: string;
  title: string;
  content: string;
  author: {
    displayName: string;
  };
  published: string;
  labels?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);
  private ai: GoogleGenAI | null = null;

  private state = signal<{ articles: Article[]; loading: boolean; error: string | null }>({
    articles: [],
    loading: true,
    error: null,
  });

  articles = computed(() => this.state().articles);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  uniqueCategories = computed(() => {
    const articles = this.articles();
    const categories = articles.map(a => ({ id: a.category, name: a.categoryDisplay }));
    const unique = [...new Map(categories.map(item => [item.id, item])).values()];
    // FIX: Explicitly type the parameters of the sort function to resolve a type inference issue where they were being inferred as 'unknown'.
    return unique.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  });

  constructor() {
    // Only initialize Gemini if a valid, non-placeholder API key is provided.
    if (environment.apiKey && environment.apiKey !== 'YOUR_API_KEY' && environment.apiKey !== 'AIzaSyAxDgGG70pxMFVFiJGDlfu2u3puztDPZD0') {
      try {
        this.ai = new GoogleGenAI({ apiKey: environment.apiKey });
      } catch (e) {
        console.error("Error initializing GoogleGenAI, please check your API key.", e);
      }
    } else {
        console.warn("Gemini API key is not configured or is a placeholder. Image generation will use fallbacks.");
    }
    this.loadArticles();
  }

  loadArticles() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    const { blogId, apiKey } = environment;
    
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&fetchImages=true&maxResults=20`;

    this.http.get<BloggerApiResponse>(url).pipe(
      switchMap(response => {
        const posts = response.items || [];
        if (posts.length === 0) {
            return of([]);
        }
        const articlePromises = posts.map(post => this.transformBloggerPostToArticle(post));
        return from(Promise.all(articlePromises));
      }),
      catchError(err => {
        console.error('Error fetching articles from Blogger:', err);
        // Provide a more specific error message if the blog might be private
        if (err.status === 404 || err.status === 401) {
             return of({ error: 'Tidak dapat menemukan blog. Pastikan ID Blog benar dan blog diatur ke "Publik" di pengaturan Blogger.' });
        }
        return of({ error: 'Tidak dapat memuat artikel. Silakan periksa koneksi internet Anda dan coba lagi nanti.' });
      })
    ).subscribe(result => {
      if (result && 'error' in result && typeof result.error === 'string') {
        this.state.set({ articles: [], loading: false, error: result.error });
      } else if (Array.isArray(result)) {
        this.state.set({ articles: result, loading: false, error: null });
      }
    });
  }
  
  private async transformBloggerPostToArticle(post: BloggerPost): Promise<Article> {
    const category = (post.labels?.[0]?.toLowerCase().trim() as ArticleCategory) || 'teknologi';
    const categoryDisplay = post.labels?.[0]?.trim() || 'Teknologi';

    let imageUrl = this.extractFirstImageUrl(post.content);
    
    if (!imageUrl && this.ai) {
        try {
            const result = await this.ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: `Ilustrasi sinematik yang menarik untuk artikel berita berjudul "${post.title}". Tema utama adalah ${categoryDisplay}. Gaya: fotografi profesional, warna cerah, dan estetika modern.`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });
            const base64ImageBytes = result.generatedImages[0].image.imageBytes;
            imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        } catch(e) {
            console.error(`Error generating image for "${post.title}":`, e);
            imageUrl = `https://picsum.photos/800/450?query=${category}`; // fallback
        }
    } else if (!imageUrl) {
        imageUrl = `https://picsum.photos/800/450?query=${category}`;
    }
    
    // Create a summary by stripping HTML and truncating
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const summary = textContent.substring(0, 200) + '...';


    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author.displayName || 'Lensa Tenggara',
      publicationDate: new Date(post.published).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      category,
      categoryDisplay,
      summary,
      imageUrl: imageUrl!,
    };
  }
  
  private extractFirstImageUrl(htmlContent: string): string | null {
    const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  }
}