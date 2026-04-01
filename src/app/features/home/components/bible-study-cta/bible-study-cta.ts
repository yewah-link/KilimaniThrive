import { Component } from '@angular/core';

@Component({
  selector: 'app-bible-study-cta',
  template: `
    <section class="bible-study-cta">
      <div class="cta-content">
        <a routerLink="/bible-study" class="btn-explore">Explore Bible Studies</a>
      </div>
    </section>
  `,
  styles: [`
    .bible-study-cta {
      background-color: var(--color-brand-light-bg);
      padding: 0 1.5rem 6rem;
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .btn-explore {
      display: inline-block;
      background-color: #3b82f6; /* Matching the blue in the screenshot */
      color: #ffffff;
      padding: 1rem 2.5rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1.05rem;
      transition: background 0.2s, transform 0.15s;
    }

    .btn-explore:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
  `]
})
export class BibleStudyCtaComponent {}
