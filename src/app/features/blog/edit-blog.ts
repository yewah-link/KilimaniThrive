import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { MediaService } from '../../core/services/media.service';
import { ResponseStatus } from '../../core/models';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { CropperDialogComponent } from '../../shared/components/cropper-dialog/cropper-dialog';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUrlPipe, CropperDialogComponent],
  template: `
    <section class="create-section">
      <div class="create-header">
        <a [routerLink]="['/blog', blogId()]" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Story
        </a>
        <h1 class="page-title">Edit Your Post</h1>
      </div>

      <div class="form-container">
        @if (loading()) {
          <div class="loading-state">
            <span class="spinner dark"></span>
            <p>Loading your story...</p>
          </div>
        } @else {
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
              <button type="button" class="btn-cancel" [routerLink]="['/blog', blogId()]">Cancel</button>
              <button type="submit" class="btn-publish" [disabled]="blogForm.invalid || submitting() || uploading()">
                @if (submitting()) {
                  <span class="spinner"></span> Saving Changes...
                } @else {
                  Update Post
                }
              </button>
            </div>
          </form>
        }
      </div>

      <!-- IMAGE CROPPER DIALOG -->
      @if (showCropper()) {
        <app-cropper-dialog
          [imageChangedEvent]="imageChangedEvent"
          [imageUrl]="imageChangedEvent ? undefined : featuredImageUrl() || undefined"
          (cropped)="handleImageCropped($event)"
          (cancel)="closeCropper()"
        ></app-cropper-dialog>
      }
    </section>
  `,
  styles: [`
    .create-section { background-color: #f8fafc; min-height: calc(100vh - 64px); padding: 3rem 1.5rem; }
    .create-header { max-width: 800px; margin: 0 auto 2rem; }
    .btn-back { display: inline-flex; align-items: center; gap: 0.25rem; color: #64748b; text-decoration: none; font-weight: 500; margin-bottom: 1.5rem; }
    .page-title { font-family: var(--font-heading); font-size: 2.5rem; color: #0f172a; font-weight: 700; }
    .form-container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 3rem; border-radius: 12px; border: 1px solid #f1f5f9; }
    .blog-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-row { display: flex; gap: 1.5rem; }
    .flex-1 { flex: 1; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.95rem; font-weight: 500; color: #1e293b; }
    .required { color: #ef4444; }
    .form-input { width: 100%; padding: 0.875rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
    .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .form-input.error { border-color: #ef4444; }
    .upload-container { border: 2px dashed #cbd5e1; border-radius: 8px; min-height: 48px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; cursor: pointer; }
    .upload-container.has-image { border: 1px solid #e2e8f0; background: #fff; }
    .upload-placeholder { width: 100%; padding: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
    .image-preview-wrapper { position: relative; width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; }
    .image-preview { max-width: 100%; max-height: 100%; object-fit: contain; }
    
    .image-actions-overlay { position: absolute; top: 0.75rem; right: 0.75rem; display: flex; gap: 0.5rem; }
    .btn-action { background: rgba(15, 23, 42, 0.7); color: white; border: none; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; border-radius: 6px; font-size: 0.75rem; font-weight: 600; padding: 0 0.75rem; }
    .btn-adjust { gap: 0.4rem; padding: 0 0.85rem; }
    .btn-adjust:hover { background: #c9a84c; }
    .btn-remove-image { width: 32px; padding: 0; border-radius: 50%; }
    .btn-remove-image:hover { background: #ef4444; }

    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
    .btn-cancel { background: transparent; border: 1px solid #cbd5e1; color: #64748b; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-publish { background: #c9a84c; color: #ffffff; padding: 0.75rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spinner.dark { border-color: rgba(15, 23, 42, 0.1); border-top-color: #3b82f6; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hidden-input { display: none; }
    .loading-state { text-align: center; padding: 3rem 0; }
  `]
})
export class EditBlogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private mediaService = inject(MediaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  blogId = signal<number>(0);
  loading = signal(true);
  submitting = signal(false);
  uploading = signal(false);
  errorMessage = signal<string | null>(null);
  featuredImageUrl = signal<string | null>(null);

  // Cropper States
  showCropper = signal(false);
  imageChangedEvent: any = '';

  blogForm = this.fb.group({
    title: ['', Validators.required],
    category: ['General'],
    featuredImage: [''],
    content: ['', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/blog']);
      return;
    }
    this.blogId.set(Number(id));
    this.fetchBlog();
  }

  fetchBlog() {
    this.blogService.getBlog(this.blogId()).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS && res._embedded) {
          const blog = res._embedded;
          this.blogForm.patchValue({
            title: blog.title,
            category: blog.tags?.[0]?.name || 'General',
            featuredImage: blog.featuredImage,
            content: blog.content
          });
          this.featuredImageUrl.set(blog.featuredImage || null);
        } else {
          this.errorMessage.set('Could not find the story to edit.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading the story.');
        this.loading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageChangedEvent = event;
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
    this.imageChangedEvent = '';
    this.blogForm.patchValue({ featuredImage: '' });
  }

  private uploadFile(file: File | Blob) {
    const reader = new FileReader();
    reader.onload = (e) => this.featuredImageUrl.set(e.target?.result as string);
    
    if (file instanceof File) {
      reader.readAsDataURL(file);
    } else {
      const blobFile = new File([file], 'cropped-image.png', { type: 'image/png' });
      reader.readAsDataURL(blobFile);
    }

    this.uploading.set(true);
    const fileToUpload = file instanceof File ? file : new File([file], 'cropped-image.png', { type: 'image/png' });
    
    this.mediaService.upload(fileToUpload).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS) {
          this.blogForm.patchValue({ featuredImage: res._embedded.url });
        } else {
          this.errorMessage.set(res.message || 'Upload failed');
          this.featuredImageUrl.set(null);
        }
        this.uploading.set(false);
      },
      error: () => {
        this.errorMessage.set('Upload error.');
        this.uploading.set(false);
        this.featuredImageUrl.set(null);
      }
    });
  }

  onSubmit() {
    if (this.blogForm.invalid) return;

    this.submitting.set(true);
    const formData = this.blogForm.value;
    
    this.blogService.update(this.blogId(), {
      title: formData.title!,
      content: formData.content!,
      featuredImage: formData.featuredImage || undefined,
      tags: [{ name: formData.category! }],
      status: 'PUBLISHED' as any
    }).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS) {
          this.router.navigate(['/blog', this.blogId()]);
        } else {
          this.errorMessage.set(res.message);
          this.submitting.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Update failed.');
        this.submitting.set(false);
      }
    });
  }
}
