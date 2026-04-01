import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bible-study',
  imports: [CommonModule],
  template: `
    <section class="bible-study-section">
      <div class="bible-study-header">
        <div class="bible-study-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <span>Grow in the Word</span>
        </div>
        <h1 class="page-title">Bible Study</h1>
        <p class="page-subtitle">
          Explore topics that strengthen your faith. Each study includes Scripture references, explanations, and reflection questions.
        </p>

        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search topics, scriptures..." class="search-input">
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
        <!-- Placeholder for actual content -->
        <p class="empty-state">No studies available right now.</p>
      </div>
    </section>
  `,
  styles: [`
    .bible-study-section {
      background-color: #f8fafc;
      min-height: calc(100vh - 64px - 200px);
    }

    .bible-study-header {
      padding: 5rem 1.5rem 3rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .bible-study-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #e0f2fe;
      padding: 0.35rem 1.25rem;
      border-radius: 9999px;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0284c7; /* Brand light-blue matching the screenshot badge */
    }

    .badge-icon {
      color: #0284c7;
    }

    .page-title {
      font-size: 3.5rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 1rem;
    }

    .page-subtitle {
      color: var(--color-brand-slate);
      font-size: 1.2rem;
      line-height: 1.6;
      max-width: 700px;
      margin: 0 auto 3rem;
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
      padding: 1.25rem 1.5rem 1.25rem 3.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1.05rem;
      font-family: inherit;
      color: var(--color-brand-navy);
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
      padding: 2rem 1.5rem 4rem;
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
      background-color: #ffffff;
      padding: 0 1.5rem 5rem;
      text-align: center;
    }

    .empty-state {
      color: #94a3b8;
      font-size: 1.1rem;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .bible-study-header { padding: 3rem 1.5rem 2rem; }
      .page-title { font-size: 2.5rem; }
      .page-subtitle { font-size: 1.05rem; }
      .search-input { padding: 1rem 1.25rem 1rem 3rem; font-size: 1rem; }
      .filters-container { padding: 1.5rem 1.5rem 3rem; }
    }
  `]
})
export class BibleStudyComponent {
  categories = ['All', 'Faith', 'Prayer', 'Salvation', 'Healing', 'Christian Living'];
  activeCategory = signal('All');

  setActiveCategory(category: string) {
    this.activeCategory.set(category);
  }
}
