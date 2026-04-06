import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TherapySessionRequest {
  name?: string;
  phoneNumberOrEmail: string;
  topic: string;
  notes: string;
  preferredDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TherapySessionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sessions`;

  bookSession(request: TherapySessionRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
}
