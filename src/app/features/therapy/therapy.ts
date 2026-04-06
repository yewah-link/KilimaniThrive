import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TherapyFormComponent } from './therapy-form';

@Component({
  selector: 'app-therapy-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TherapyFormComponent],
  template: `
    <section class="therapy-hero">
      <div class="hero-overlay"></div>
      <div class="hero-background">
        <img src="/therapy-hero.png" alt="Serene therapy room" />
      </div>
      
      <div class="hero-content">
        <span class="badge fade-in-up">Professional Counseling</span>
        <h1 class="fade-in-up delay-1">Find Your Peace <br> Within the Storm</h1>
        <p class="fade-in-up delay-2">
          Life can be overwhelming. Whether you're dealing with stress, anxiety, or simply need someone to listen, 
          our compassionate counselors are here for you. Take the first step towards healing today.
        </p>
        <div class="hero-actions fade-in-up delay-3">
          <button class="btn-primary pulse-hover" (click)="openBookingForm()">
            Book a Session Now
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </section>

    <section class="therapy-features">
      <div class="feature-card fade-in-up">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        </div>
        <h3>Confidential</h3>
        <p>Your privacy is our utmost priority. All sessions are completely secure and confidential.</p>
      </div>
      <div class="feature-card fade-in-up delay-1">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
        </div>
        <h3>Compassionate Care</h3>
        <p>Experienced professionals providing a safe space without judgment.</p>
      </div>
      <div class="feature-card fade-in-up delay-2">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <h3>Flexible Scheduling</h3>
        <p>Find a time that works for your busy life, offering both virtual and in-person options.</p>
      </div>
    </section>

    @if (showForm) {
      <div class="modal-backdrop fade-in" (click)="closeBookingForm()">
        <div class="modal-content scale-in" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeBookingForm()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <app-therapy-form (formSubmitted)="closeBookingForm()"></app-therapy-form>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .fade-in-up { opacity: 0; animation: fadeInUp 0.8s ease-out forwards; }
    .delay-1 { animation-delay: 0.2s; } .delay-2 { animation-delay: 0.4s; } .delay-3 { animation-delay: 0.6s; }
    .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .scale-in { animation: scaleIn 0.3s ease-out forwards; }

    .therapy-hero { position: relative; min-height: 85vh; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 2rem; color: #ffffff; }
    .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; }
    .hero-background img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
    .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(30, 45, 66, 0.9) 0%, rgba(44, 62, 90, 0.7) 100%); z-index: -1; backdrop-filter: blur(2px); }
    .hero-content { max-width: 800px; text-align: center; z-index: 1; }
    .badge { display: inline-block; padding: 0.5rem 1.2rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50px; backdrop-filter: blur(10px); font-size: 0.9rem; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1.5rem; color: var(--color-brand-gold-light); }
    .hero-content h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); font-family: var(--font-heading); box-sizing: border-box; }
    .hero-content p { font-size: clamp(1.1rem, 2vw, 1.3rem); font-weight: 300; line-height: 1.6; margin-bottom: 2.5rem; color: #e0e6ed; max-width: 650px; margin-left: auto; margin-right: auto; }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.8rem; padding: 1rem 2.5rem; background: var(--color-brand-gold); color: white; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 600; cursor: pointer; box-shadow: 0 10px 25px -5px rgba(212, 168, 67, 0.4); transition: all 0.3s ease; font-family: var(--font-body); }
    .btn-primary:hover { transform: translateY(-3px); background: var(--color-brand-gold-dark); box-shadow: 0 15px 35px -5px rgba(212, 168, 67, 0.6); }
    .btn-primary svg { transition: transform 0.3s ease; }
    .btn-primary:hover svg { transform: translateX(4px); }

    .therapy-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; margin-top: -60px; position: relative; z-index: 2; }
    .feature-card { background: #ffffff; border-radius: 20px; padding: 2.5rem; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.03); transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .feature-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
    .feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 70px; height: 70px; background: var(--color-brand-cream-dark); color: var(--color-brand-gold-dark); border-radius: 50%; margin-bottom: 1.5rem; }
    .feature-icon svg { width: 30px; height: 30px; }
    .feature-card h3 { font-size: 1.5rem; color: var(--color-brand-navy-dark); margin-bottom: 1rem; font-family: var(--font-heading); font-weight: 600; }
    .feature-card p { color: var(--color-brand-slate); line-height: 1.6; }

    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(30, 45, 66, 0.8); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal-content { background: var(--color-brand-cream); border-radius: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: #ffffff; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-brand-slate); cursor: pointer; transition: all 0.2s ease; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .close-btn:hover { background: var(--color-brand-gold-light); color: var(--color-brand-navy-dark); }
  `]
})
export class TherapyPageComponent {
  showForm: boolean = false;

  openBookingForm() {
    this.showForm = true;
  }

  closeBookingForm() {
    this.showForm = false;
  }
}
