import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services';
import { ResponseStatus } from '../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="auth-section">
      <div class="auth-container">
        <div class="auth-header">
          <h1 class="page-title">Join Kilimani Thrive</h1>
          <p class="page-subtitle">Create an account to connect with our community.</p>
        </div>

        @if (errorMessage()) {
          <div class="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form class="auth-form" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-group flex-1">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" id="firstName" name="firstName" class="form-input" placeholder="John" [(ngModel)]="firstName" required>
            </div>
            <div class="form-group flex-1">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Doe" [(ngModel)]="lastName" required>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" id="email" name="email" class="form-input" placeholder="you@example.com" [(ngModel)]="email" required>
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number (Optional)</label>
            <input type="tel" id="phone" name="phone" class="form-input" placeholder="+254 700 000000" [(ngModel)]="phoneNumber">
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-wrapper">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                name="password" 
                class="form-input" 
                placeholder="••••••••" 
                [(ngModel)]="password" 
                required>
              <button type="button" class="password-toggle" (click)="togglePassword()">
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88L3 3m18 18l-6.88-6.88m-5.12 1.12A9 9 0 011 12a9 9 0 0113.88-7.88M10.12 16.12A9 9 0 0023 12a9 9 0 00-13.88-7.88M15 12a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3 3 3 0 013 3z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" class="auth-button" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span> Creating Account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login" class="login-link">Sign in</a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .auth-section {
      background-color: #f8fafc;
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }

    .auth-container {
      background: #ffffff;
      width: 100%;
      max-width: 500px; /* Slightly wider for register form */
      padding: 3rem 2.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
      border: 1px solid #f1f5f9;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .page-title {
      font-family: var(--font-heading);
      font-size: 2.25rem;
      color: var(--color-brand-navy-dark);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .page-subtitle {
      color: var(--color-brand-slate);
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    .flex-1 {
      flex: 1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-brand-navy);
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      color: var(--color-brand-navy);
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .password-input-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      transition: color 0.2s;
    }

    .password-toggle:hover {
      color: var(--color-brand-navy);
    }

    .auth-button {
      background: var(--color-brand-navy-dark);
      color: #ffffff;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      transition: all 0.2s;
    }

    .auth-button:hover:not(:disabled) {
      background: var(--color-brand-navy);
    }

    .auth-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: #64748b;
      font-size: 0.95rem;
    }

    .login-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }

    .login-link:hover {
      text-decoration: underline;
    }

    .error-alert {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #ffffff;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phoneNumber = signal('');
  password = signal('');
  showPassword = signal(false);
  
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.email() || !this.password() || !this.firstName()) {
      this.errorMessage.set("Please fill all required fields.");
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phoneNumber: this.phoneNumber(),
      password: this.password()
    }).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.status === ResponseStatus.SUCCESS) {
            this.router.navigate(['/']); // Redirect to home on success
          } else {
            this.errorMessage.set(res.message);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || "Failed to create account. Please try again.");
        }
      });
  }
}
