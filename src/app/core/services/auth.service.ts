import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GenericResponse, ResponseStatus } from '../models/response.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly userApiUrl = `${environment.apiUrl}/user`;
  private readonly TOKEN_KEY = 'jwt_token';
  
  // State
  private currentUserSignal = signal<User | null>(null);
  
  // Computed State
  public currentUser = computed(() => this.currentUserSignal());
  public isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient) {
    this.checkInitialAuthState();
  }

  login(credentials: LoginRequest): Observable<GenericResponse<AuthResponse>> {
    return this.http.post<GenericResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          const isSuccess = response.status === ResponseStatus.SUCCESS || (response.status as any) === 'SUCCESS';
          if (isSuccess && response._embedded) {
            this.handleAuthentication(response._embedded);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<GenericResponse<AuthResponse>> {
    return this.http.post<GenericResponse<AuthResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          const isSuccess = response.status === ResponseStatus.SUCCESS || (response.status as any) === 'SUCCESS';
          if (isSuccess && response._embedded) {
            this.handleAuthentication(response._embedded);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthentication(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    this.currentUserSignal.set(authData.user);
  }

  private checkInitialAuthState(): void {
    const token = this.getToken();
    if (token) {
      // Fetch the real profile instead of a dummy user
      this.fetchCurrentUser().subscribe({
        next: (response) => {
          const isSuccess = response.status === ResponseStatus.SUCCESS || (response.status as any) === 'SUCCESS';
          if (isSuccess && response._embedded) {
            this.currentUserSignal.set(response._embedded);
          } else {
            this.logout(); // Token might be invalid
          }
        },
        error: () => this.logout() // Error fetching profile, probably expired token
      });
    }
  }

  private fetchCurrentUser(): Observable<GenericResponse<User>> {
    return this.http.get<GenericResponse<User>>(`${this.userApiUrl}/me`);
  }
}
