import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper-dialog',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Adjust Your Image</h3>
          <button class="btn-close" (click)="onCancel()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="cropper-body">
          <image-cropper
            [imageChangedEvent]="imageChangedEvent"
            [imageURL]="imageUrl"
            [maintainAspectRatio]="true"
            [aspectRatio]="16 / 9"
            [format]="'png'"
            [autoCrop]="true"
            (imageCropped)="imageCropped($event)"
            style="min-height: 400px; width: 100%; display: block;"
          ></image-cropper>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-save" (click)="onSave()">Save Changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal-content { background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .modal-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .modal-header h3 { font-family: var(--font-heading); font-weight: 700; color: #1e293b; margin: 0; }
    .btn-close { background: none; border: none; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
    .btn-close:hover { color: #ef4444; }
    .cropper-body { position: relative; padding: 1.5rem; background: #f8fafc; flex: 1; min-height: 400px; display: flex; align-items: center; justify-content: center; }
    .cropper-loader { position: absolute; inset: 0; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; z-index: 10; }
    
    .modal-footer { padding: 1.25rem 1.5rem; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #f1f5f9; background: #fff; }
    .btn-cancel { background: transparent; border: 1px solid #cbd5e1; color: #64748b; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-save { background: #c9a84c; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-save:hover { background: #b0913e; }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner { width: 32px; height: 32px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #c9a84c; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Custom Cropper Styles */
    ::ng-deep .ngx-ic-cropper { max-height: 60vh !important; }
  `]
})
export class CropperDialogComponent {
  @Input() imageChangedEvent: any;
  @Input() imageUrl?: string;
  @Output() cropped = new EventEmitter<Blob>();
  @Output() cancel = new EventEmitter<void>();

  croppedImageBlob: Blob | null = null;
  isReady = signal(false);

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob || null;
  }

  onSave() {
    if (this.croppedImageBlob) {
      this.cropped.emit(this.croppedImageBlob);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
