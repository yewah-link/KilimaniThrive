import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { BibleStudy } from '../models/bible-study.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BibleStudyService {
  private readonly apiUrl = `${environment.apiUrl}/bible-study`;

  constructor(private http: HttpClient) {}

  add(study: BibleStudy): Observable<GenericResponse<BibleStudy>> {
    return this.http.post<GenericResponse<BibleStudy>>(`${this.apiUrl}/add`, study);
  }

  update(id: number, study: BibleStudy): Observable<GenericResponse<BibleStudy>> {
    return this.http.put<GenericResponse<BibleStudy>>(`${this.apiUrl}/update/${id}`, study);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  getBibleStudy(id: number): Observable<GenericResponse<BibleStudy>> {
    return this.http.get<GenericResponse<BibleStudy>>(`${this.apiUrl}/${id}`);
  }

  getAllBibleStudies(): Observable<GenericResponse<BibleStudy[]>> {
    return this.http.get<GenericResponse<BibleStudy[]>>(this.apiUrl);
  }
}
