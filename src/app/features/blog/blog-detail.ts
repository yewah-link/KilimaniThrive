import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { AuthService } from '../../core/services/auth.service';
import { Blog } from '../../core/models/blog.model';
import { ResponseStatus } from '../../core/models/response.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { CommentSectionComponent } from './comment-section';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe, CommentSectionComponent],
  template: `
    <div class="detail-page">

      @if (loading()) {
        <div class="loading-state">
          <div class="pulse-ring"></div>
          <p class="loading-text">Loading story...</p>
        </div>
      }

      @else if (error()) {
        <div class="error-state">
          <h2>Story Not Found</h2>
          <a routerLink="/blog" class="btn-primary">Return to Blog</a>
        </div>
      }

      @else if (blog()) {
        <!-- HERO -->
        <div class="hero" [class.no-image]="!blog()!.featuredImage">
          @if (blog()!.featuredImage) {
            <img [src]="blog()!.featuredImage | imageUrl" [alt]="blog()!.title" class="hero-bg">
          }
          <div class="hero-gradient"></div>

          <div class="hero-inner">
            <a routerLink="/blog" class="back-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
              Blog
            </a>

            <div class="hero-content">
              <span class="hero-category">{{ blog()!.tags?.[0]?.name || 'General' }}</span>
              <h1 class="hero-title">{{ blog()!.title }}</h1>

              <div class="hero-meta">
                <div class="author-row">
                  <div class="author-avatar">{{ getInitials(blog()!.authorName) }}</div>
                  <div class="author-info">
                    <span class="author-name">{{ blog()!.authorName || 'Anonymous' }}</span>
                    <span class="author-date">{{ blog()!.createdAt | date:'MMMM d, y' }}</span>
                  </div>
                </div>

                    <div class="hero-actions">
                      @if (isAuthor() || isAdmin()) {
                        <a [routerLink]="['/blog/edit', blog()!.id]" class="edit-pill">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit Story
                        </a>
                      }
                  <button class="like-pill" (click)="likePost()" [class.liked]="liked()">
                    <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="liked() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    {{ blog()!.likes || 0 }} {{ (blog()!.likes || 0) === 1 ? 'Like' : 'Likes' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="article-wrapper">
          <article class="article">
            <!-- STAR DIVIDER -->
            <div class="star-divider">
              <span></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-brand-gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span></span>
            </div>

            <div class="article-body">
              @for (paragraph of getParagraphs(blog()!.content); track $index) {
                <p [class.drop-cap]="$index === 0">{{ paragraph }}</p>
              }
            </div>

            <div class="star-divider">
              <span></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-brand-gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span></span>
            </div>

            <div class="article-footer">
              <span class="tag-label">{{ blog()!.tags?.[0]?.name || 'General' }}</span>
              <button class="footer-like-btn" (click)="likePost()" [class.liked]="liked()">
                <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="liked() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                Like this post
              </button>
            </div>

            <!-- COMMENT SECTION -->
            <app-comment-section [blogId]="blog()!.id!"></app-comment-section>
          </article>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lora:ital@0;1&family=Inter:wght@400;500;600&display=swap');

    .detail-page { background: #fafaf8; min-height: 100vh; }
    .hero { position: relative; width: 100%; height: 75vh; min-height: 550px; overflow: hidden; display: flex; flex-direction: column; }
    .hero.no-image { background: #0f172a; height: auto; padding-bottom: 4rem; }
    .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
    .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)); }
    .hero-inner { position: relative; z-index: 10; max-width: 1000px; width: 100%; margin: 0 auto; padding: 0 1.5rem; height: 100%; display: flex; flex-direction: column; }
    .back-pill { margin-top: 2rem; display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.4rem 1.25rem; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 0.85rem; backdrop-filter: blur(4px); transition: all 0.2s; }
    .back-pill:hover { background: rgba(255,255,255,0.1); }
    .hero-content { margin-top: auto; margin-bottom: 3.5rem; max-width: 800px; }
    .hero-category { display: inline-block; color: #c9a84c; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; background: rgba(201,168,76,0.1); padding: 0.35rem 0.75rem; border-radius: 4px; margin-bottom: 1.25rem; }
    .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 3.8rem); font-weight: 800; color: white; line-height: 1.1; margin-bottom: 2rem; }
    .hero-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
    .author-row { display: flex; align-items: center; gap: 0.875rem; }
    .author-avatar { width: 44px; height: 44px; border-radius: 50%; background: #c9a84c; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.3); }
    .author-name { display: block; font-weight: 600; color: white; font-size: 1rem; }
    .author-date { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.4); }
    .hero-actions { display: flex; gap: 0.75rem; align-items: center; }
    .edit-pill, .like-pill { display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.6rem 1.4rem; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; cursor: pointer; backdrop-filter: blur(4px); text-decoration: none; transition: all 0.2s; }
    .edit-pill:hover { background: rgba(255,255,255,0.1); border-color: white; }
    .like-pill.liked { color: #f87171; border-color: #ef4444; }
    .article-wrapper { max-width: 800px; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
    .star-divider { display: flex; align-items: center; gap: 1.5rem; margin: 3rem 0; }
    .star-divider span { flex: 1; height: 1px; background: #e5e0d5; }
    .article-body { font-family: 'Lora', serif; font-size: 1.2rem; line-height: 1.8; color: #2d2d2d; }
    .article-body p { margin-bottom: 2rem; }
    .article-body p.drop-cap::first-letter {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      font-weight: 800;
      float: left;
      line-height: 0.8;
      margin: 0.12em 0.1em -0.1em 0;
      color: #c9a84c;
    }
    .article-footer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #f1f0eb; }
    .tag-label { background: #f1f0eb; color: #7c7261; padding: 0.4rem 1.25rem; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; border: 1px solid #e5e0d5; }
    .footer-like-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: 1px solid #e2e8f0; color: #94a3b8; padding: 0.6rem 1.25rem; border-radius: 9999px; font-weight: 600; cursor: pointer; }
    .footer-like-btn.liked { color: #ef4444; border-color: #ef4444; }
    .loading-state { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; }
    .pulse-ring { width: 60px; height: 60px; border: 2px solid #c9a84c; border-radius: 50%; opacity: 0; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
    @media (max-width: 768px) { .hero { height: auto; min-height: unset; padding-bottom: 3rem; } .hero-title { font-size: 2rem; } .hero-content { margin-top: 4rem; } }
  `]
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  authService = inject(AuthService);

  blog = signal<Blog | null>(null);
  loading = signal(true);
  error = signal(false);
  liked = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/blog']); return; }

    const savedLikes: number[] = JSON.parse(localStorage.getItem('blog_likes') || '[]');
    this.liked.set(savedLikes.includes(Number(id)));

    this.blogService.getBlog(Number(id)).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS && res._embedded) {
          this.blog.set(res._embedded);
        } else { this.error.set(true); }
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  isAuthor() {
    const b = this.blog();
    const u = this.authService.currentUser();
    return b && u && b.authorId === u.id;
  }

  isAdmin() {
    const u = this.authService.currentUser();
    return u && u.role === 'ADMIN';
  }

  likePost() {
    const b = this.blog();
    if (!b || this.liked()) return;

    // 1. Optimistic Update (Instant feedback)
    this.liked.set(true);
    this.blog.update(current => current ? { ...current, likes: (current.likes || 0) + 1 } : current);
    
    const savedLikes: number[] = JSON.parse(localStorage.getItem('blog_likes') || '[]');
    savedLikes.push(b.id!);
    localStorage.setItem('blog_likes', JSON.stringify(savedLikes));

    // 2. Server Request
    this.blogService.like(b.id!).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS && res._embedded) {
          this.blog.set(res._embedded);
        }
      },
      error: () => {
        // Fallback
        this.liked.set(false);
        this.blog.update(current => current ? { ...current, likes: (current.likes || 1) - 1 } : current);
        const rollbackLikes = savedLikes.filter(id => id !== b.id);
        localStorage.setItem('blog_likes', JSON.stringify(rollbackLikes));
      }
    });
  }


  getParagraphs(content: string): string[] {
    if (!content) return [];
    return content.split('\n').filter(p => p.trim().length > 0);
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
