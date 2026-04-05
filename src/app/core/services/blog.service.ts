import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { Blog } from '../models/blog.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly apiUrl = `${environment.apiUrl}/blog`;

  constructor(private http: HttpClient) {}

  add(blog: Blog): Observable<GenericResponse<Blog>> {
    return this.http.post<GenericResponse<Blog>>(`${this.apiUrl}/add`, blog);
  }

  update(id: number, blog: Blog): Observable<GenericResponse<Blog>> {
    return this.http.put<GenericResponse<Blog>>(`${this.apiUrl}/update/${id}`, blog);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  getBlog(id: number): Observable<GenericResponse<Blog>> {
    return this.http.get<GenericResponse<Blog>>(`${this.apiUrl}/${id}`);
  }

  getAllBlogs(): Observable<GenericResponse<Blog[]>> {
    return this.http.get<GenericResponse<Blog[]>>(this.apiUrl);
  }

  like(id: number): Observable<GenericResponse<Blog>> {
    return this.http.post<GenericResponse<Blog>>(`${this.apiUrl}/${id}/like`, {});
  }
}
