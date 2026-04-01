import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-scripture',
  template: `
    <section class="daily-scripture">
      <div class="scripture-container">
        <div class="scripture-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <span>Daily Scripture</span>
        </div>
        <blockquote class="scripture-quote">
          "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
        </blockquote>
        <p class="scripture-reference">— Jeremiah 29:11</p>
      </div>
    </section>
  `,
  styles: [`
    .daily-scripture {
      background-color: var(--color-brand-cream);
      padding: 5rem 1.5rem;
      text-align: center;
    }

    .scripture-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .scripture-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-brand-cream-dark);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      margin-bottom: 2rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-brand-navy-dark);
    }

    .badge-icon {
      color: var(--color-brand-navy-dark);
    }

    .scripture-quote {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      line-height: 1.3;
      color: var(--color-brand-navy);
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .scripture-reference {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-brand-gold);
    }

    @media (max-width: 768px) {
      .scripture-quote {
        font-size: 1.75rem;
      }
    }
  `]
})
export class DailyScriptureComponent {}
