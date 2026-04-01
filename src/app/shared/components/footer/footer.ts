import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <!-- Branding Column -->
        <div class="footer-col">
          <div class="footer-logo">
            <span class="logo-icon">🔥</span>
            <span class="logo-text">Kilimani Thrive</span>
          </div>
          <p class="footer-desc">
            A community rooted in faith, devoted to prayer,
            and committed to spreading the love of Christ.
          </p>
        </div>

        <!-- Quick Links Column -->
        <div class="footer-col">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/prayer-requests">Prayer Requests</a></li>
            <li><a routerLink="/bible-study">Bible Study</a></li>
            <li><a href="#">Sign In</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer-col">
          <h4 class="footer-heading">Contact Us</h4>
          <ul class="footer-contact">
            <li>
              <span class="contact-icon">✉</span>
              <span>contact&#64;kilimanithrive.org</span>
            </li>
            <li>
              <span class="contact-icon">📞</span>
              <span>+254 700 000 000</span>
            </li>
            <li>
              <span class="contact-icon">📍</span>
              <span>Kilimani, Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p>&copy; 2026 Kilimani Thrive Ministries. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-brand-navy-dark);
      color: #cbd5e1;
      padding-top: 3rem;
    }

    .footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem 2.5rem;
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.2fr;
      gap: 3rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .logo-icon { font-size: 1.4rem; }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
    }

    .footer-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      color: #94a3b8;
    }

    .footer-heading {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1.25rem;
      text-decoration: underline;
      text-decoration-color: var(--color-brand-gold);
      text-underline-offset: 6px;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-links a {
      font-size: 0.9rem;
      color: #94a3b8;
      transition: color 0.2s;
    }

    .footer-links a:hover { color: var(--color-brand-gold); }

    .footer-contact {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .footer-contact li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .contact-icon {
      font-size: 1rem;
      color: var(--color-brand-gold);
    }

    .footer-bottom {
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      text-align: center;
      padding: 1.25rem 1.5rem;
    }

    .footer-bottom p {
      font-size: 0.8rem;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `],
})
export class FooterComponent {}
