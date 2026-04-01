import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-icon">🔥</span>
          <span class="logo-text">Kilimani Thrive</span>
        </a>

        <!-- Desktop Nav Links -->
        <ul class="nav-links">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          </li>
          <li>
            <a routerLink="/prayer-requests" routerLinkActive="active">Prayer Requests</a>
          </li>
          <li><a routerLink="/bible-study" routerLinkActive="active">Bible Study</a></li>
          <li><a routerLink="/blog" routerLinkActive="active">Blog</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <!-- CTA + Sign In -->
        <div class="nav-actions">
          <a routerLink="/prayer-requests" class="btn-submit-prayer">Submit Prayer</a>
          <a href="#" class="btn-sign-in">Sign In</a>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" (click)="toggleMenu()" [attr.aria-label]="'Toggle menu'">
          @if (menuOpen()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      <!-- Mobile Menu -->
      @if (menuOpen()) {
        <div class="mobile-menu">
          <a routerLink="/" (click)="closeMenu()">Home</a>
          <a routerLink="/prayer-requests" (click)="closeMenu()">Prayer Requests</a>
          <a routerLink="/bible-study" (click)="closeMenu()">Bible Study</a>
          <a routerLink="/blog" (click)="closeMenu()">Blog</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <div class="mobile-menu-actions">
            <a routerLink="/prayer-requests" class="btn-submit-prayer" (click)="closeMenu()">Submit Prayer</a>
            <a href="#" class="btn-sign-in">Sign In</a>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-brand-navy);
      transition: opacity 0.2s;
    }

    .logo:hover { opacity: 0.8; }

    .logo-icon { font-size: 1.4rem; }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-links a {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-brand-navy);
      transition: color 0.2s;
      position: relative;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: var(--color-brand-gold);
    }

    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-brand-gold);
      border-radius: 1px;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-submit-prayer {
      background: var(--color-brand-gold);
      color: #ffffff;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      transition: background 0.2s, transform 0.15s;
    }

    .btn-submit-prayer:hover {
      background: var(--color-brand-gold-dark);
      transform: translateY(-1px);
    }

    .btn-sign-in {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-brand-navy);
      transition: color 0.2s;
    }

    .btn-sign-in:hover { color: var(--color-brand-gold); }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--color-brand-navy);
      padding: 0.25rem;
    }

    .mobile-menu {
      display: none;
      flex-direction: column;
      padding: 1rem 1.5rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .mobile-menu a {
      padding: 0.75rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-brand-navy);
      border-bottom: 1px solid #f3f4f6;
      transition: color 0.2s;
    }

    .mobile-menu a:hover { color: var(--color-brand-gold); }

    .mobile-menu-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .mobile-menu-actions .btn-submit-prayer {
      text-align: center;
    }

    .mobile-menu-actions .btn-sign-in {
      text-align: center;
    }

    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .mobile-toggle { display: block; }
      .mobile-menu { display: flex; }
    }
  `],
})
export class NavbarComponent {
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
