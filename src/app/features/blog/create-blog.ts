import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { MediaService } from '../../core/services/media.service';
import { ResponseStatus } from '../../core/models';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { CropperDialogComponent } from '../../shared/components/cropper-dialog/cropper-dialog';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUrlPipe, CropperDialogComponent],
  template: `
    <section class="create-section">
      <div class="create-header">
        <a routerLink="/blog" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Blog
        </a>
        <h1 class="page-title">Write a New Post</h1>
      </div>

      <div class="form-container">
        @if (errorMessage()) {
          <div class="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="blog-form">
          <div class="form-group">
            <label for="title" class="form-label">Title <span class="required">*</span></label>
            <input type="text" id="title" formControlName="title" class="form-input" placeholder="Give your post a title"
                   [class.error]="isFieldInvalid('title')">
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="category" class="form-label">Category</label>
              <select id="category" formControlName="category" class="form-input">
                <option value="General">General</option>
                <option value="Testimony">Testimony</option>
                <option value="Devotional">Devotional</option>
                <option value="Teaching">Teaching</option>
                <option value="Encouragement">Encouragement</option>
              </select>
            </div>
            
            <div class="form-group flex-1">
              <label class="form-label">Featured Image</label>
              <div class="upload-container" [class.has-image]="featuredImageUrl()">
                @if (featuredImageUrl()) {
                  <div class="image-preview-wrapper">
                    <img [src]="featuredImageUrl()! | imageUrl" alt="Featured Image Preview" class="image-preview">
                    <div class="image-actions-overlay">
                      <button type="button" class="btn-action btn-adjust" (click)="openCropper()" title="Edit Image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                        Edit Image
                      </button>
                      <button type="button" class="btn-action btn-remove-image" (click)="removeImage()" title="Remove Image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                } @else {
                  <div class="upload-placeholder" (click)="fileInput.click()">
                    <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden-input">
                    <div class="upload-icon">
                      @if (uploading()) {
                        <span class="spinner dark"></span>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      }
                    </div>
                    <span class="upload-text">{{ uploading() ? 'Uploading...' : 'Click to upload featured image' }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="content" class="form-label">Content <span class="required">*</span></label>
            <textarea id="content" formControlName="content" rows="12" class="form-input" placeholder="Write your post here..."
                      [class.error]="isFieldInvalid('content')"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" routerLink="/blog">Cancel</button>
            <button type="submit" class="btn-publish" [disabled]="blogForm.invalid || submitting() || uploading()">
              @if (submitting()) {
                <span class="spinner"></span> Publishing...
              } @else {
                Publish Post
              }
            </button>
          </div>
        </form>
      </div>

      <!-- IMAGE CROPPER DIALOG -->
      @if (showCropper()) {
        <app-cropper-dialog
          [imageFile]="imageFile"
          [imageUrl]="undefined"
          (cropped)="handleImageCropped($event)"
          (cancel)="closeCropper()"
        ></app-cropper-dialog>
      }
    </section>
  `,
  styles: [`
    .create-section {
      background-color: #f8fafc;
      min-height: calc(100vh - 64px);
      padding: 3rem 1.5rem;
    }

    .create-header {
      max-width: 800px;
      margin: 0 auto 2rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      margin-bottom: 1.5rem;
      transition: color 0.2s;
    }

    .btn-back:hover { color: var(--color-brand-navy); }

    .page-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      color: var(--color-brand-navy-dark);
      font-weight: 700;
    }

    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
      border: 1px solid #f1f5f9;
    }

    .blog-form {
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

    .form-label {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--color-brand-navy-dark);
    }

    .required { color: #ef4444; }

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

    .form-input.error { border-color: #ef4444; }

    /* Upload UI Styles */
    .upload-container {
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      background: #f8fafc;
      overflow: hidden;
    }

    .upload-container:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .upload-container.has-image {
      border: 1px solid #e2e8f0;
      background: #fff;
    }

    .upload-placeholder {
      width: 100%;
      padding: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .hidden-input { display: none; }

    .upload-icon {
      color: #64748b;
      display: flex;
      align-items: center;
    }

    .upload-text {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 300px;
      background-color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
    }

    .image-preview {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .image-actions-overlay {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      background: rgba(15, 23, 42, 0.7);
      color: white;
      border: none;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.2s;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0 0.75rem;
    }

    .btn-adjust { gap: 0.4rem; padding: 0 0.85rem; }
    .btn-adjust:hover { background: var(--color-brand-gold); }

    .btn-remove-image { width: 32px; padding: 0; border-radius: 50%; }
    .btn-remove-image:hover { background: #ef4444; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f1f5f9;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid #cbd5e1;
      color: #64748b;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-cancel:hover { background: #f8fafc; }

    .btn-publish {
      background: var(--color-brand-gold);
      color: #ffffff;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-publish:hover:not(:disabled) {
      background: var(--color-brand-gold-dark);
      transform: translateY(-1px);
    }

    .btn-publish:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner.dark {
      border: 2px solid rgba(15, 23, 42, 0.1);
      border-top-color: #3b82f6;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .form-row { flex-direction: column; gap: 1.5rem; }
      .form-container { padding: 1.5rem; }
      .page-title { font-size: 2rem; }
    }
  `]
})
export class CreateBlogComponent {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private mediaService = inject(MediaService);
  private router = inject(Router);

  blogForm = this.fb.group({
    title: ['', Validators.required],
    category: ['General'],
    featuredImage: [''],
    content: ['', Validators.required]
  });

  submitting = signal(false);
  uploading = signal(false);
  errorMessage = signal<string | null>(null);
  featuredImageUrl = signal<string | null>(null);
  
  // Cropper States
  showCropper = signal(false);
  imageFile: File | null = null;

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      // Best UX: Open cropper instantly before any local preview or upload
      this.openCropper();
    }
  }

  openCropper() {
    this.showCropper.set(true);
  }

  closeCropper() {
    this.showCropper.set(false);
  }

  handleImageCropped(blob: Blob) {
    this.closeCropper();
    this.uploadFile(blob);
  }

  removeImage() {
    this.featuredImageUrl.set(null);
    this.imageFile = null;
    this.blogForm.patchValue({ featuredImage: '' });
  }


  private uploadFile(file: File | Blob) {
    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.featuredImageUrl.set(e.target?.result as string);
    };
    
    if (file instanceof File) {
      reader.readAsDataURL(file);
    } else {
      // It's a blob from the cropper
      const blobFile = new File([file], 'cropped-image.jpg', { type: 'image/jpeg' });
      reader.readAsDataURL(blobFile);
    }

    // 2. Server upload
    this.uploading.set(true);
    this.errorMessage.set(null);
    
    const fileToUpload = file instanceof File ? file : new File([file], 'cropped-image.jpg', { type: 'image/jpeg' });

    this.mediaService.upload(fileToUpload).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS) {
          this.blogForm.patchValue({ featuredImage: res._embedded.url });
        } else {
          this.errorMessage.set(res.message || 'Failed to upload image');
          this.featuredImageUrl.set(null);
        }
        this.uploading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error uploading image. Please try again.');
        this.uploading.set(false);
        this.featuredImageUrl.set(null);
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const formData = this.blogForm.value;
    
    this.blogService.add({
      title: formData.title!,
      content: formData.content!,
      featuredImage: formData.featuredImage || undefined,
      tags: [{ id: 1, name: formData.category! }],
      status: 'PUBLISHED' as any
    }).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS) {
          this.router.navigate(['/blog']);
        } else {
          this.submitting.set(false);
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set('Failed to publish the post. Please try again.');
        console.error(err);
      }
    });
  }
}
