import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  template: `
    <section class="blog-section">
      <div class="blog-header">
        <h1 class="page-title">Community Blog</h1>
        <p class="page-subtitle">
          Stories of faith, testimonies, and encouragement from the Kilimani Thrive community.
        </p>

        <p class="sign-in-prompt">
          <a href="#" class="sign-in-link">Sign in</a> to share your story.
        </p>

        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search posts..." class="search-input">
        </div>
      </div>

      <div class="filters-container">
        @for (category of categories; track category) {
          <button
            class="filter-btn"
            [class.active]="activeCategory() === category"
            (click)="setActiveCategory(category)">
            {{ category }}
          </button>
        }
      </div>

      <div class="content-container">
        <p class="empty-state">No posts yet.</p>
      </div>
    </section>
  `,
  styles: [`
    .blog-section {
      background-color: #ffffff;
      min-height: calc(100vh - 64px - 200px);
    }

    .blog-header {
      padding: 5rem 1.5rem 2rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-title {
      font-family: var(--font-heading);
      font-size: 3.5rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .page-subtitle {
      color: var(--color-brand-slate);
      font-size: 1.15rem;
      line-height: 1.6;
      max-width: 700px;
      margin: 0 auto 1.5rem;
    }

    .sign-in-prompt {
      color: var(--color-brand-slate);
      font-size: 1.05rem;
      margin-bottom: 3rem;
    }

    .sign-in-link {
      color: #2563eb;
      text-decoration: underline;
      text-decoration-color: #93c5fd;
      text-underline-offset: 4px;
      font-weight: 500;
      transition: text-decoration-color 0.2s;
    }

    .sign-in-link:hover {
      text-decoration-color: #2563eb;
    }

    .search-container {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-input {
      width: 100%;
      padding: 1.15rem 1.5rem 1.15rem 3.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1.05rem;
      font-family: inherit;
      color: var(--color-brand-navy);
      background: #ffffff;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filters-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      padding: 1rem 1.5rem 4rem;
      background-color: #ffffff;
      max-width: 100%;
    }

    .filter-btn {
      background: #f1f5f9;
      color: var(--color-brand-navy);
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .filter-btn.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
    }

    .filter-btn:not(.active):hover {
      background: #e2e8f0;
    }

    .content-container {
      padding: 2rem 1.5rem 5rem;
      text-align: center;
    }

    .empty-state {
      color: #64748b;
      font-size: 1.15rem;
    }

    @media (max-width: 768px) {
      .blog-header { padding: 3rem 1.5rem 2rem; }
      .page-title { font-size: 2.5rem; }
      .page-subtitle, .sign-in-prompt { font-size: 1.05rem; }
      .search-input { padding: 1rem 1.25rem 1rem 3rem; font-size: 1rem; }
      .filters-container { padding: 0.5rem 1.5rem 3rem; }
    }
  `]
})
export class BlogComponent {
  categories = ['All', 'Testimony', 'Devotional', 'Teaching', 'Encouragement', 'General'];
  activeCategory = signal('All');

  setActiveCategory(category: string) {
    this.activeCategory.set(category);
  }
}
