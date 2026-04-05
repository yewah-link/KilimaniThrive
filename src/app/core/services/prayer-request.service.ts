import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { GenericResponse, ResponseStatus } from '../models/response.model';
import { environment } from '../../../environments/environment';

export interface PrayerRequest {
  id?: number;
  name?: string;
  phoneNumberOrRegCode: string;
  request: string;
  status?: string;
  likes?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrayerRequestService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/prayer-requests`;

  async submitPrayerRequest(request: PrayerRequest): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<GenericResponse<PrayerRequest>>(this.apiUrl, request)
    );
    return response.status === ResponseStatus.SUCCESS || (response.status as any) === 'SUCCESS';
  }

  async getCommunityPrayers(): Promise<PrayerRequest[]> {
    const response = await firstValueFrom(
      this.http.get<GenericResponse<PrayerRequest[]>>(`${this.apiUrl}/community`)
    );
    return response._embedded || [];
  }

  like(id: number): Observable<GenericResponse<PrayerRequest>> {
    return this.http.post<GenericResponse<PrayerRequest>>(`${this.apiUrl}/${id}/like`, {});
  }
}
