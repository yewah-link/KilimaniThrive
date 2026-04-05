import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/response.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  add(user: User): Observable<GenericResponse<User>> {
    return this.http.post<GenericResponse<User>>(`${this.apiUrl}/add`, user);
  }

  update(id: number, user: User): Observable<GenericResponse<User>> {
    return this.http.put<GenericResponse<User>>(`${this.apiUrl}/update/${id}`, user);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  getUser(id: number): Observable<GenericResponse<User>> {
    return this.http.get<GenericResponse<User>>(`${this.apiUrl}/${id}`);
  }

  getAllUsers(): Observable<GenericResponse<User[]>> {
    return this.http.get<GenericResponse<User[]>>(this.apiUrl);
  }
}
