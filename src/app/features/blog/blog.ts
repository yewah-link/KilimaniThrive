import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { AuthService } from '../../core/services/auth.service';
import { Blog } from '../../core/models/blog.model';
import { ResponseStatus } from '../../core/models/response.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  template: `
    <section class="blog-section">
      <div class="blog-hero">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <h1 class="page-title">Community Blog</h1>
          <p class="page-subtitle">
            Stories of faith, testimonies, and encouragement from the Kilimani Thrive community.
          </p>

          <div class="search-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search posts..." class="search-input">
          </div>
        </div>
      </div>

      <div class="content-container">
        <div class="blog-toolbar">
          <div class="category-filters">
            @for (category of displayCategories; track category) {
              <button 
                class="filter-pill" 
                [class.active]="activeCategory() === category"
                (click)="setActiveCategory(category)">
                {{ category }}
              </button>
            }
          </div>
          @if (authService.isAuthenticated()) {
            <a routerLink="create" class="btn-create-post">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Write a Post
            </a>
          }
        </div>

        @if (blogs().length === 0 && !loading()) {
          <p class="empty-state">No posts yet.</p>
        } @else if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading stories...</p>
          </div>
        } @else {
          <div class="blog-grid">
            @for (blog of filteredBlogs(); track blog.id) {
              <a [routerLink]="['/blog', blog.id]" class="blog-card">
                <div class="blog-card-image" *ngIf="blog.featuredImage">
                  <img [src]="blog.featuredImage | imageUrl" [alt]="blog.title">
                  <div class="card-actions-overlay" *ngIf="isStoryOwner(blog)">
                    <a [routerLink]="['/blog/edit', blog.id]" class="btn-card-edit" (click)="$event.stopPropagation()" title="Edit Story">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </a>
                  </div>
                </div>
                <div class="blog-card-content">
                  <span class="blog-category">{{ blog.tags?.[0]?.name || 'General' }}</span>
                  <h3 class="blog-title">{{ blog.title }}</h3>
                  <p class="blog-excerpt">{{ (blog.content | slice:0:120) + '...' }}</p>
                  
                  <div class="blog-meta">
                    <span class="blog-author">By {{ blog.authorName || 'Anonymous' }}</span>
                    <div class="blog-stats">
                      <div class="stat-item" [class.liked]="isLiked(blog.id!)" (click)="likePost(blog.id!); $event.stopPropagation(); $event.preventDefault()">
                        <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="isLiked(blog.id!) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        <span>{{ blog.likes || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

    .blog-section {
      background-color: #fafaf8;
      padding-bottom: 5rem;
    }

    .blog-hero {
      position: relative;
      width: 100%;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('/hero-bg.png') center/cover no-repeat;
      margin-bottom: 4rem;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
    }

    .hero-inner {
      position: relative;
      z-index: 10;
      text-align: center;
      max-width: 800px;
      padding: 0 1.5rem;
    }

    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
      color: #ffffff;
      margin-bottom: 1rem;
      font-weight: 800;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .page-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 3rem;
      text-shadow: 0 1px 5px rgba(0,0,0,0.2);
    }

    .search-container {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-icon {
      position: absolute;
      left: 1rem; top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-input {
      width: 100%;
      padding: 0.85rem 1.5rem 0.85rem 3rem;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 9999px;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.95);
      color: #1e293b;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .search-input::placeholder {
      color: #64748b;
    }

    .search-input:focus { 
      border-color: #c9a84c; 
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(201,168,76,0.2); 
    }

    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .blog-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      gap: 1.5rem;
    }

    .category-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    .filter-pill {
      background: white; color: #64748b;
      padding: 0.5rem 1.25rem; border: 1px solid #e5e7eb;
      border-radius: 9999px; font-size: 0.85rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }

    .filter-pill.active { background: #c9a84c; color: white; border-color: #c9a84c; }

    .btn-create-post {
      background: #0f172a; color: white;
      padding: 0.6rem 1.25rem; border-radius: 8px;
      font-weight: 600; font-size: 0.9rem;
      text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .blog-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      border: 1px solid #f1ede5;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .blog-card:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 20px 40px rgba(0,0,0,0.06); 
      border-color: #e5e0d5;
    }

    .blog-card-image {
      height: 240px; width: 100%; overflow: hidden;
      background: #f8f8f6; display: flex; align-items: center; justify-content: center;
    }

    .blog-card-image img { 
      width: 100%; height: 100%; object-fit: cover; 
      transition: transform 0.5s;
    }
    .blog-card:hover .blog-card-image img { transform: scale(1.05); }
    
    .card-actions-overlay { position: absolute; top: 0.75rem; right: 0.75rem; z-index: 10; }
    .btn-card-edit { background: rgba(15, 23, 42, 0.75); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2); }
    .btn-card-edit:hover { background: #c9a84c; border-color: #c9a84c; transform: scale(1.1); }

    .blog-card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }

    .blog-category {
      color: #c9a84c; font-weight: 800; font-size: 0.7rem;
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem;
    }

    .blog-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; color: #1e293b;
      margin-bottom: 0.75rem; line-height: 1.2; font-weight: 800;
    }

    .blog-excerpt {
      color: #64748b; font-size: 0.875rem; line-height: 1.5;
      margin-bottom: 1.5rem; flex: 1;
    }

    .blog-meta {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 1.25rem; border-top: 1px solid #f1f0eb;
    }

    .blog-author { font-weight: 700; color: #334155; font-size: 0.85rem; }

    .blog-stats { display: flex; gap: 1rem; color: #94a3b8; }

    .stat-item { 
      display: flex; align-items: center; gap: 0.3rem; 
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
    }
    .stat-item:hover { color: #ef4444; }
    .stat-item.liked { color: #ef4444; }

    .loading-state { text-align: center; padding: 5rem 0; color: #94a3b8; }
    .spinner { 
      width: 40px; height: 40px; border: 3px solid #f1f0eb; border-top-color: #c9a84c; 
      border-radius: 50%; margin: 0 auto 1rem; animation: spin 0.8s linear infinite; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .page-title { font-size: 2.5rem; }
      .blog-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);
  authService = inject(AuthService);

  categories = ['All', 'Testimony', 'Devotional', 'Teaching', 'Encouragement', 'General'];
  activeCategory = signal('All');

  get displayCategories() {
    return this.authService.isAuthenticated() 
      ? ['My Stories', ...this.categories] 
      : this.categories;
  }
  
  blogs = signal<Blog[]>([]);
  loading = signal(true);
  likedPosts = signal<Set<number>>(new Set());

  ngOnInit() {
    this.fetchBlogs();
    const savedLikes = localStorage.getItem('blog_likes');
    if (savedLikes) { this.likedPosts.set(new Set(JSON.parse(savedLikes))); }
  }

  fetchBlogs() {
    this.loading.set(true);
    this.blogService.getAllBlogs().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.SUCCESS) {
          this.blogs.set(response._embedded || []);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setActiveCategory(category: string) { this.activeCategory.set(category); }
  
  filteredBlogs() {
    const all = this.blogs();
    const cat = this.activeCategory();
    const user = this.authService.currentUser();

    if (cat === 'My Stories' && user) {
      return all.filter(b => b.authorId === user.id);
    }
    
    if (cat === 'All') return all;
    
    return all.filter(blog => 
      blog.tags?.some(tag => tag.name.toLowerCase() === cat.toLowerCase())
    );
  }

  isStoryOwner(blog: Blog) {
    const user = this.authService.currentUser();
    return user && (blog.authorId === user.id || user.role === 'ADMIN');
  }

  likePost(blogId: number) {
    if (this.isLiked(blogId)) return;
    
    // 1. Optimistic Update (Instant UI Feedback)
    const newLikes = new Set(this.likedPosts());
    newLikes.add(blogId);
    this.likedPosts.set(newLikes);
    localStorage.setItem('blog_likes', JSON.stringify(Array.from(newLikes)));

    // Increment count locally immediately
    this.blogs.update(blogs => blogs.map(b => 
      b.id === blogId ? { ...b, likes: (b.likes || 0) + 1 } : b
    ));

    // 2. Background Server Request
    this.blogService.like(blogId).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.SUCCESS && response._embedded) {
          // Sync with server completely
          this.blogs.update(blogs => blogs.map(b => 
            b.id === blogId ? response._embedded! : b
          ));
        }
      },
      error: () => {
        // Fallback: remove the optimistic like if server fails
        newLikes.delete(blogId);
        this.likedPosts.set(newLikes);
        localStorage.setItem('blog_likes', JSON.stringify(Array.from(newLikes)));
        this.blogs.update(blogs => blogs.map(b => 
          b.id === blogId ? { ...b, likes: (b.likes || 1) - 1 } : b
        ));
      }
    });
  }


  isLiked(blogId: number): boolean { return this.likedPosts().has(blogId); }
}
