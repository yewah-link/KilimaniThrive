import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { Comment } from '../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  add(comment: Comment): Observable<GenericResponse<Comment>> {
    return this.http.post<GenericResponse<Comment>>(`${this.apiUrl}/add`, comment);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  getComment(id: number): Observable<GenericResponse<Comment>> {
    return this.http.get<GenericResponse<Comment>>(`${this.apiUrl}/${id}`);
  }

  getCommentsForBlog(blogId: number): Observable<GenericResponse<Comment[]>> {
    return this.http.get<GenericResponse<Comment[]>>(`${this.apiUrl}/blog/${blogId}`);
  }
}
