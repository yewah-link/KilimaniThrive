import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { Tag } from '../models/tag.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly apiUrl = `${environment.apiUrl}/tag`;

  constructor(private http: HttpClient) {}

  add(tag: Tag): Observable<GenericResponse<Tag>> {
    return this.http.post<GenericResponse<Tag>>(`${this.apiUrl}/add`, tag);
  }

  update(id: number, tag: Tag): Observable<GenericResponse<Tag>> {
    return this.http.put<GenericResponse<Tag>>(`${this.apiUrl}/update/${id}`, tag);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  getTag(id: number): Observable<GenericResponse<Tag>> {
    return this.http.get<GenericResponse<Tag>>(`${this.apiUrl}/${id}`);
  }

  getAllTags(): Observable<GenericResponse<Tag[]>> {
    return this.http.get<GenericResponse<Tag[]>>(this.apiUrl);
  }
}
