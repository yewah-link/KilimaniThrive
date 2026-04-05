import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrayerRequestService, PrayerRequest } from '../../core/services/prayer-request.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-prayer-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <section class="prayer-section">
      <div class="prayer-header">
        <div class="prayer-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span>We Stand With You in Prayer</span>
        </div>
        <h1 class="prayer-title">Submit a Prayer Request</h1>
        <p class="prayer-subtitle">
          Share your prayer needs with our community. Every request is treated with care and confidentiality.
        </p>
      </div>

      <div class="prayer-form-container">
        @if (submitted()) {
          <div class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3>Prayer Request Received</h3>
            <p>Thank you for sharing your heart with us. Our prayer team will be interceding for you.</p>
            <button class="btn-submit" (click)="resetForm()">Submit Another Request</button>
          </div>
        } @else {
          <form [formGroup]="prayerForm" (ngSubmit)="onSubmit()" class="prayer-form">
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="name">Name (optional)</label>
                <input type="text" id="name" formControlName="name" placeholder="Your name">
              </div>

              <div class="form-group flex-1">
                <label for="contact">Phone Number / Registration Number <span class="required">*</span></label>
                <input type="text" id="contact" formControlName="contact" placeholder="e.g. +254 700 000..."
                       [class.error]="isFieldInvalid('contact')">
              </div>
            </div>

            <div class="form-group">
              <label for="request">Your Prayer Request <span class="required">*</span></label>
              <textarea id="request" formControlName="request" rows="5" placeholder="Share what's on your heart..."
                        [class.error]="isFieldInvalid('request')"></textarea>
            </div>

            <button type="submit" class="btn-submit" [disabled]="prayerForm.invalid || submitting()">
              @if (submitting()) {
                <span class="spinner"></span> Submitting...
              } @else {
                Submit Prayer Request
              }
            </button>
          </form>
        }
      </div>

      @if (authService.isAuthenticated()) {
        <div class="prayer-wall-container">
          <h2 class="prayer-wall-title">Community Prayers</h2>
          <div class="prayer-wall-grid">
            @for (prayer of communityPrayers(); track prayer.id) {
              <div class="prayer-card">
                <p class="prayer-content">"{{ prayer.request }}"</p>
                <div class="meta-bottom">
                  <div class="author-info-group">
                    <span class="prayer-author">— {{ prayer.name || 'Anonymous' }}</span>
                    <span class="prayer-time" *ngIf="prayer.createdAt">{{ prayer.createdAt | date:'shortTime' }} • {{ prayer.createdAt | date:'MMM d' }}</span>
                  </div>
                  
                  <div class="prayer-actions">
                    <button class="btn-like-prayer" 
                            [class.liked]="isLiked(prayer.id!)"
                            (click)="likePrayer(prayer.id!)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" [attr.fill]="isLiked(prayer.id!) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.53l-2.1 7A2 2 0 0 1 17.74 21H6.78a2 2 0 0 1-1.96-1.61L3.33 11a2 2 0 0 1 1.96-2.39h5.13l.85-4.72A2 2 0 0 1 13.19 2.21z"/></svg>
                      <span>{{ prayer.likes || 0 }}</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
          @if (communityPrayers().length === 0) {
            <p class="empty-state">No community prayers available at the moment.</p>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .prayer-section {
      background-color: #f8fafc;
      min-height: calc(100vh - 64px - 200px);
      padding: 5rem 1.5rem;
    }

    .prayer-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    .prayer-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-brand-cream-dark);
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-brand-navy-dark);
    }

    .badge-icon {
      color: var(--color-brand-navy-dark);
    }

    .prayer-title {
      font-family: var(--font-heading);
      font-size: 3.5rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 1rem;
    }

    .prayer-subtitle {
      color: var(--color-brand-slate);
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .prayer-form-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
      border: 1px solid #f1f5f9;
    }

    .prayer-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1.5rem;
    }

    .flex-1 { flex: 1; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--color-brand-navy-dark);
    }

    .required { color: #ef4444; }

    input, textarea {
      padding: 0.85rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      color: var(--color-brand-navy);
      transition: all 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input.error, textarea.error { border-color: #ef4444; }

    .btn-submit {
      background: var(--color-brand-gold);
      color: #ffffff;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.05rem;
      margin-top: 1rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    .btn-submit:hover:not(:disabled) {
      background: var(--color-brand-gold-dark);
      transform: translateY(-2px);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-message {
      text-align: center;
      padding: 2rem 1rem;
    }

    .success-icon {
      color: #10b981;
      margin-bottom: 1.5rem;
    }

    .success-message h3 {
      font-family: var(--font-heading);
      font-size: 2.25rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 1rem;
    }

    .success-message p {
      color: var(--color-brand-slate);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .prayer-wall-container {
      max-width: 900px;
      margin: 5rem auto 0;
      border-top: 1px solid #e2e8f0;
      padding-top: 4rem;
    }

    .prayer-wall-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 3rem;
      text-align: center;
    }

    .prayer-wall-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .prayer-card {
      background: #ffffff;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid #f1f5f9;
      transition: transform 0.2s;
      display: flex;
      flex-direction: column;
    }

    .prayer-card:hover { transform: translateY(-4px); }

    .meta-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .author-info-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .prayer-author {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-brand-gold-dark);
    }

    .prayer-time {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .prayer-actions {
      display: flex;
      align-items: center;
    }

    .btn-like-prayer {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-like-prayer:hover {
      background: #f1f5f9;
      color: var(--color-brand-gold);
      border-color: var(--color-brand-gold-light);
    }

    .btn-like-prayer.liked {
      background: #fff9eb;
      color: var(--color-brand-gold);
      border-color: var(--color-brand-gold);
    }

    @media (max-width: 768px) {
      .prayer-section { padding: 3rem 1.5rem; }
      .prayer-title { font-size: 2.5rem; }
      .prayer-form-container { padding: 2rem 1.5rem; }
      .form-row { flex-direction: column; gap: 1.5rem; }
    }
  `]
})
export class PrayerRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prayerService = inject(PrayerRequestService);
  authService = inject(AuthService);

  prayerForm = this.fb.group({
    name: [''],
    contact: ['', Validators.required],
    request: ['', Validators.required]
  });

  submitting = signal(false);
  submitted = signal(false);
  
  communityPrayers = signal<PrayerRequest[]>([]);
  likedPrayers = signal<Set<number>>(new Set());

  ngOnInit() {
    this.loadCommunityPrayers();
    const saved = localStorage.getItem('prayer_likes');
    if (saved) {
      this.likedPrayers.set(new Set(JSON.parse(saved)));
    }
  }

  private async loadCommunityPrayers() {
    if (this.authService.isAuthenticated()) {
      try {
        const prayers = await this.prayerService.getCommunityPrayers();
        this.communityPrayers.set(prayers);
      } catch (error) {
        console.error('Failed to load community prayers', error);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.prayerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  async onSubmit() {
    if (this.prayerForm.invalid) {
      this.prayerForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      await this.prayerService.submitPrayerRequest({
        name: this.prayerForm.value.name || undefined,
        phoneNumberOrRegCode: this.prayerForm.value.contact!,
        request: this.prayerForm.value.request!
      });
      this.submitted.set(true);
      await this.loadCommunityPrayers(); // Refresh the wall after submission
    } catch (error) {
      console.error('Failed to submit prayer request', error);
    } finally {
      this.submitting.set(false);
    }
  }

  likePrayer(id: number) {
    if (this.isLiked(id)) return;

    this.prayerService.like(id).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS' || (res.status as any) === 'SUCCESS' || res._embedded) {
          this.communityPrayers.update(prayers => 
            prayers.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p)
          );
          
          const newLikes = new Set(this.likedPrayers());
          newLikes.add(id);
          this.likedPrayers.set(newLikes);
          localStorage.setItem('prayer_likes', JSON.stringify(Array.from(newLikes)));
        }
      }
    });
  }

  isLiked(id: number): boolean {
    return this.likedPrayers().has(id);
  }

  resetForm() {
    this.prayerForm.reset();
    this.submitted.set(false);
  }
}
