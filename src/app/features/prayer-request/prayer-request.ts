import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrayerRequestService } from '../../core/services/prayer-request.service';

@Component({
  selector: 'app-prayer-request',
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
            <div class="form-group">
              <label for="name">Name (optional)</label>
              <input type="text" id="name" formControlName="name" placeholder="Your name">
            </div>

            <div class="form-group">
              <label for="contact">Phone Number or Registration Number <span class="required">*</span></label>
              <input type="text" id="contact" formControlName="contact" placeholder="e.g. +254 700 000 000 or REG-001"
                     [class.error]="isFieldInvalid('contact')">
              @if (isFieldInvalid('contact')) {
                <div class="error-message">This field is required</div>
              }
            </div>

            <div class="form-group">
              <label for="request">Your Prayer Request <span class="required">*</span></label>
              <textarea id="request" formControlName="request" rows="5" placeholder="Share what's on your heart..."
                        [class.error]="isFieldInvalid('request')"></textarea>
              @if (isFieldInvalid('request')) {
                <div class="error-message">Please provide your prayer request</div>
              }
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
    </section>
  `,
  styles: [`
    .prayer-section {
      background-color: #fafbfc;
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
      fill: transparent;
    }

    .prayer-title {
      font-size: 3rem;
      color: var(--color-brand-navy);
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
    }

    .prayer-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

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

    .required {
      color: #ef4444;
    }

    input, textarea {
      padding: 0.85rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      color: var(--color-brand-navy);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #94a3b8;
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
    }

    input.error, textarea.error {
      border-color: #ef4444;
    }

    input.error:focus, textarea.error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .btn-submit {
      background: var(--color-brand-gold);
      color: #ffffff;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.05rem;
      margin-top: 1rem;
      transition: background 0.2s, transform 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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
      animation: spin 1s linear infinite;
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
      font-size: 2rem;
      color: var(--color-brand-navy);
      margin-bottom: 1rem;
    }

    .success-message p {
      color: var(--color-brand-slate);
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    @media (max-width: 768px) {
      .prayer-section { padding: 3rem 1.5rem; }
      .prayer-title { font-size: 2.25rem; }
      .prayer-form-container { padding: 2rem 1.5rem; }
    }
  `]
})
export class PrayerRequestComponent {
  private fb = inject(FormBuilder);
  private prayerService = inject(PrayerRequestService);

  prayerForm = this.fb.group({
    name: [''],
    contact: ['', Validators.required],
    request: ['', Validators.required]
  });

  submitting = signal(false);
  submitted = signal(false);

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
    } catch (error) {
      console.error('Failed to submit prayer request', error);
      // In a real app, show error toast
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm() {
    this.prayerForm.reset();
    this.submitted.set(false);
  }
}
