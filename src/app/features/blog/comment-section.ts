import { Component, Input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Comment } from '../../core/models/comment.model';
import { ResponseStatus } from '../../core/models/response.model';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-container">
      <div class="comments-header">
        <h3>Community Conversation ({{ totalComments() }})</h3>
        <p class="comments-subtitle">Share your thoughts and encouragement.</p>
      </div>

      <!-- New Comment Form -->
      <div class="comment-form-wrapper" *ngIf="authService.isAuthenticated(); else loginPrompt">
        <div class="user-avatar-small">{{ getInitials(authService.currentUser()?.firstName) }}</div>
        <div class="form-body">
          <textarea 
            [(ngModel)]="newCommentText" 
            placeholder="Write a comment..." 
            class="comment-textarea"
            rows="3"></textarea>
          <div class="form-actions">
            <button 
              class="btn-submit-comment" 
              [disabled]="!newCommentText.trim() || submitting()"
              (click)="postComment()">
              {{ submitting() ? 'Posting...' : 'Post Comment' }}
            </button>
          </div>
        </div>
      </div>

      <ng-template #loginPrompt>
        <div class="login-prompt">
          <p>Please <a routerLink="/login">Sign in</a> to join the conversation.</p>
        </div>
      </ng-template>

      <!-- Comments List -->
      <div class="comments-list">
        @for (comment of rootComments(); track comment.id) {
          <div class="comment-item">
            <div class="comment-main">
              <div class="author-avatar">{{ comment.authorInitial }}</div>
              <div class="comment-content">
                <div class="comment-author-meta">
                  <span class="author-name">{{ comment.authorName }}</span>
                  <span class="comment-date">{{ comment.createdAt | date:'short' }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                
                <div class="comment-actions">
                  <button 
                    *ngIf="authService.isAuthenticated()"
                    (click)="setReplyingTo(comment.id!)" 
                    class="btn-reply-link">
                    Reply
                  </button>
                </div>

                <!-- Reply Form -->
                <div class="reply-form-wrapper" *ngIf="replyingTo() === comment.id">
                  <textarea 
                    [(ngModel)]="replyText" 
                    placeholder="Write a reply..." 
                    class="reply-textarea"
                    rows="2"></textarea>
                  <div class="reply-actions">
                    <button class="btn-cancel" (click)="setReplyingTo(null)">Cancel</button>
                    <button 
                      class="btn-submit-reply" 
                      [disabled]="!replyText.trim() || submitting()"
                      (click)="postReply(comment.id!)">
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nested Replies (Level 2) -->
            <div class="replies-list" *ngIf="getReplies(comment.id!).length > 0">
              @for (reply of getReplies(comment.id!); track reply.id) {
                <div class="reply-item">
                  <div class="author-avatar-tiny">{{ reply.authorInitial }}</div>
                  <div class="reply-content">
                    <div class="comment-author-meta">
                      <span class="author-name">{{ reply.authorName }}</span>
                      <span class="comment-date">{{ reply.createdAt | date:'short' }}</span>
                    </div>
                    <p class="comment-text">{{ reply.content }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="empty-comments" *ngIf="!loading()">
            <p>No comments yet. Be the first to share!</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .comments-container {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid #f1f0eb;
    }

    .comments-header { margin-bottom: 2rem; }
    .comments-header h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #1e293b; margin-bottom: 0.25rem; }
    .comments-subtitle { color: #64748b; font-size: 0.9rem; }

    .comment-form-wrapper {
      display: flex; gap: 1rem; margin-bottom: 3rem;
      background: #ffffff; padding: 1.25rem; border-radius: 12px; border: 1px solid #f1ede5;
    }

    .user-avatar-small {
      width: 36px; height: 36px; border-radius: 50%; background: #c9a84c; color: white;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;
    }

    .form-body { flex: 1; }
    .comment-textarea {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.75rem;
      font-family: inherit; font-size: 0.95rem; resize: none; outline: none; transition: border-color 0.2s;
    }
    .comment-textarea:focus { border-color: #c9a84c; }

    .form-actions { display: flex; justify-content: flex-end; margin-top: 0.75rem; }
    .btn-submit-comment {
      background: #0f172a; color: white; border: none; padding: 0.6rem 1.25rem;
      border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
    }
    .btn-submit-comment:disabled { opacity: 0.5; cursor: not-allowed; }

    .login-prompt {
      background: #f8fafc; padding: 1.5rem; text-align: center; border-radius: 12px; margin-bottom: 3rem;
      color: #64748b; font-size: 0.95rem;
    }
    .login-prompt a { color: #c9a84c; font-weight: 600; text-decoration: none; }

    .comments-list { display: flex; flex-direction: column; gap: 2.5rem; }

    .comment-item { display: flex; flex-direction: column; gap: 1rem; }
    .comment-main { display: flex; gap: 1rem; }

    .author-avatar {
      width: 40px; height: 40px; border-radius: 50%; background: #f1f0eb; color: #7c7261;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
    }

    .comment-content { flex: 1; }
    .comment-author-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
    .author-name { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .comment-date { color: #94a3b8; font-size: 0.75rem; }
    .comment-text { color: #334155; line-height: 1.6; font-size: 1rem; margin-bottom: 0.75rem; white-space: pre-wrap; }

    .comment-actions { margin-bottom: 0.5rem; }
    .btn-reply-link {
      background: none; border: none; color: #c9a84c; font-weight: 600; font-size: 0.8rem;
      padding: 0; cursor: pointer;
    }
    .btn-reply-link:hover { text-decoration: underline; }

    .reply-form-wrapper { margin-top: 1rem; background: #fafaf9; padding: 1rem; border-radius: 8px; border: 1px solid #f1ede5; }
    .reply-textarea {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0.5rem;
      font-family: inherit; font-size: 0.9rem; resize: none; outline: none;
    }
    .reply-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-cancel { background: none; border: none; color: #94a3b8; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
    .btn-submit-reply {
      background: #c9a84c; color: white; border: none; padding: 0.4rem 1rem;
      border-radius: 4px; font-weight: 600; font-size: 0.8rem; cursor: pointer;
    }

    .replies-list {
      margin-left: 3rem; padding-left: 1rem; border-left: 2px solid #f1f0eb;
      display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;
    }

    .reply-item { display: flex; gap: 0.75rem; }
    .author-avatar-tiny {
      width: 28px; height: 28px; border-radius: 50%; background: #f8f8f6; color: #94a3b8;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.7rem; flex-shrink: 0;
    }
    .reply-content { flex: 1; }

    .empty-comments { text-align: center; padding: 3rem 0; color: #94a3b8; border: 2px dashed #f1f0eb; border-radius: 12px; }
  `]
})
export class CommentSectionComponent implements OnInit {
  @Input() blogId!: number;

  private commentService = inject(CommentService);
  authService = inject(AuthService);

  comments = signal<Comment[]>([]);
  loading = signal(true);
  submitting = signal(false);

  newCommentText = '';
  replyingTo = signal<number | null>(null);
  replyText = '';

  ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.loading.set(true);
    this.commentService.getCommentsForBlog(this.blogId).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS) {
          this.comments.set(res._embedded || []);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  rootComments() {
    return this.comments().filter(c => !c.parentId).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  getReplies(commentId: number) {
    return this.comments().filter(c => c.parentId === commentId).sort((a, b) => 
      new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }

  totalComments() {
    return this.comments().length;
  }

  postComment() {
    if (!this.newCommentText.trim() || this.submitting()) return;

    this.submitting.set(true);
    const comment: Comment = {
      content: this.newCommentText,
      blogId: this.blogId
    };

    this.commentService.add(comment).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS && res._embedded) {
          this.comments.update(old => [res._embedded!, ...old]);
          this.newCommentText = '';
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  setReplyingTo(id: number | null) {
    this.replyingTo.set(id);
    this.replyText = '';
  }

  postReply(parentId: number) {
    if (!this.replyText.trim() || this.submitting()) return;

    this.submitting.set(true);
    const reply: Comment = {
      content: this.replyText,
      blogId: this.blogId,
      parentId: parentId
    };

    this.commentService.add(reply).subscribe({
      next: (res) => {
        if (res.status === ResponseStatus.SUCCESS && res._embedded) {
          this.comments.update(old => [...old, res._embedded!]);
          this.setReplyingTo(null);
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }
}
