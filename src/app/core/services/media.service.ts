import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { MediaResponse } from '../models/media.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly apiUrl = `${environment.apiUrl}/media`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<GenericResponse<MediaResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<GenericResponse<MediaResponse>>(`${this.apiUrl}/upload`, formData);
  }

  delete(fileName: string): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${fileName}`);
  }
}
