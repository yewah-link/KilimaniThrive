import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TherapySessionService } from '../../core/services/therapy-session.service';

@Component({
  selector: 'app-therapy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>Book a Therapy Session</h2>
        <p>We're here to help. Fill out the form below and we'll get back to you to confirm your appointment.</p>
      </div>

      @if (submitSuccess) {
        <div class="success-message fade-in">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Request Sent Successfully!</h3>
          <p>Thank you for reaching out. We will contact you soon.</p>
        </div>
      } @else {
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="therapy-form fade-in">
          
          @if (submitError) {
            <div class="error-alert">
              {{ submitError }}
            </div>
          }

          <div class="form-group">
            <label for="name">Full Name (Optional)</label>
            <input type="text" id="name" formControlName="name" placeholder="John Doe">
          </div>

          <div class="form-group">
            <label for="phoneNumberOrEmail">Phone Number or Email *</label>
            <input type="text" id="phoneNumberOrEmail" formControlName="phoneNumberOrEmail" placeholder="How can we reach you?">
            @if (bookingForm.get('phoneNumberOrEmail')?.touched && bookingForm.get('phoneNumberOrEmail')?.invalid) {
              <span class="error-text">Contact info is required.</span>
            }
          </div>

          <div class="form-group">
            <label for="topic">Primary Topic *</label>
            <select id="topic" formControlName="topic">
              <option value="" disabled selected>Select a topic</option>
              <option value="Marriage">Marriage & Relationships</option>
              <option value="Bible Studies">Bible Studies & Spiritual Growth</option>
              <option value="Stress & Anxiety">Stress & Anxiety</option>
              <option value="Life & Health">Life Challenges & Health</option>
            </select>
            @if (bookingForm.get('topic')?.touched && bookingForm.get('topic')?.invalid) {
              <span class="error-text">Please select a topic.</span>
            }
          </div>

          <div class="form-group">
            <label for="preferredDate">Preferred Date & Time (Optional)</label>
            <input type="datetime-local" id="preferredDate" formControlName="preferredDate">
          </div>

          <div class="form-group">
            <label for="notes">How can we help? *</label>
            <textarea id="notes" formControlName="notes" rows="4" placeholder="Share a little bit about what you're experiencing..."></textarea>
            @if (bookingForm.get('notes')?.touched && bookingForm.get('notes')?.invalid) {
              <span class="error-text">Please provide at least 10 characters.</span>
            }
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="isSubmitting">
              @if (isSubmitting) {
                <span class="spinner"></span> Sending...
              } @else {
                Send Request
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .form-container { padding: 3rem; background: #ffffff; }
    .form-header { text-align: center; margin-bottom: 2rem; }
    .form-header h2 { font-size: 2rem; color: var(--color-brand-navy-dark); margin-bottom: 0.5rem; font-family: var(--font-heading); font-weight: 700; }
    .form-header p { color: var(--color-brand-slate); font-size: 1.05rem; }
    .therapy-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 500; color: var(--color-brand-navy-light); font-size: 0.95rem; }
    .form-group input, .form-group select, .form-group textarea {
      padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem;
      font-family: var(--font-body); transition: all 0.2s ease; background: var(--color-brand-cream-dark);
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none; border-color: var(--color-brand-gold); background: #ffffff; box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.25);
    }
    .error-text { color: #ef4444; font-size: 0.85rem; margin-top: -0.25rem; }
    .error-alert { background: #fef2f2; color: #b91c1c; padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444; font-size: 0.95rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--color-brand-cream-dark); }
    .btn-secondary { padding: 0.8rem 1.5rem; background: transparent; color: var(--color-brand-slate); border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn-secondary:hover { background: var(--color-brand-cream); color: var(--color-brand-navy-dark); }
    .btn-primary { padding: 0.8rem 2rem; background: var(--color-brand-gold); color: #ffffff; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s ease; }
    .btn-primary:hover:not(:disabled) { background: var(--color-brand-gold-dark); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner { width: 1rem; height: 1rem; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .success-message { text-align: center; padding: 3rem 1rem; }
    .success-icon { width: 64px; height: 64px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .success-message h3 { font-size: 1.5rem; color: var(--color-brand-navy-dark); margin-bottom: 0.5rem; font-family: var(--font-heading); }
    .success-message p { color: var(--color-brand-slate); }
    @media (max-width: 640px) {
      .form-container { padding: 2rem 1.5rem; }
      .form-actions { flex-direction: column-reverse; }
      .btn-secondary, .btn-primary { width: 100%; }
    }
  `]
})
export class TherapyFormComponent {
  @Output() formSubmitted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private therapyService = inject(TherapySessionService);

  bookingForm: FormGroup = this.fb.group({
    name: [''],
    phoneNumberOrEmail: ['', Validators.required],
    topic: ['', Validators.required],
    preferredDate: [''],
    notes: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.therapyService.bookSession(this.bookingForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        setTimeout(() => this.formSubmitted.emit(), 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to submit the request. Please try again.';
        console.error('Error booking session', err);
      }
    });
  }

  cancel() {
    this.formSubmitted.emit();
  }
}
