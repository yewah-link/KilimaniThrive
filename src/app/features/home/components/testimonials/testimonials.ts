import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  template: `
    <section class="testimonials-section">
      <div class="testimonials-header">
        <h2 class="section-title">Answered Prayers & Testimonies</h2>
        <p class="section-subtitle">
          Hear from members of our community whose lives have been touched by God's faithfulness.
        </p>
      </div>

      <div class="testimonials-grid">
        <!-- Testimonial 1 -->
        <div class="testimonial-card">
          <div class="quote-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </div>
          <p class="testimonial-text">
            I submitted a prayer request during one of the hardest seasons of my life. Within weeks, God opened doors I never expected. Thank you for standing with me in prayer.
          </p>
          <div class="testimonial-author">
            <div class="author-avatar avatar-m">M</div>
            <span class="author-name">Maria S.</span>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="testimonial-card">
          <div class="quote-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </div>
          <p class="testimonial-text">
            My family was going through a medical crisis. The prayer team reached out personally and lifted us up. God healed my daughter — we are forever grateful.
          </p>
          <div class="testimonial-author">
            <div class="author-avatar avatar-d">D</div>
            <span class="author-name">David K.</span>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="testimonial-card">
          <div class="quote-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </div>
          <p class="testimonial-text">
            After years of searching, I found peace through the Bible study group here. The community is genuine and the teachings transformed my understanding of God's word.
          </p>
          <div class="testimonial-author">
            <div class="author-avatar avatar-g">G</div>
            <span class="author-name">Grace T.</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-section {
      background-color: var(--color-brand-light-bg);
      padding: 5rem 1.5rem;
    }

    .testimonials-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 3.5rem;
    }

    .section-title {
      font-size: 2.25rem;
      color: var(--color-brand-navy);
      margin-bottom: 1rem;
    }

    .section-subtitle {
      color: var(--color-brand-slate);
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: #ffffff;
      padding: 2.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    .quote-icon {
      color: var(--color-brand-gold-light);
      margin-bottom: 1.5rem;
    }

    .testimonial-text {
      color: var(--color-brand-navy);
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      flex-grow: 1;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 1.5rem;
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-brand-navy);
      font-size: 1rem;
    }

    .avatar-m { background-color: #e0f2fe; color: #0284c7; }
    .avatar-d { background-color: #f3e8ff; color: #9333ea; }
    .avatar-g { background-color: #dcfce7; color: #16a34a; }

    .author-name {
      font-weight: 700;
      color: var(--color-brand-navy-dark);
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .section-title { font-size: 1.75rem; }
    }
  `]
})
export class TestimonialsComponent {}
