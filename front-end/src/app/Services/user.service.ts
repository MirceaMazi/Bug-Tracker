import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { HttpClient } from '@angular/common/http';
import { BACK_URL } from 'src/const';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const url = `${BACK_URL}/api/user`;
    return this.http.get(url, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    const url = `${BACK_URL}/api/auth/current`;
    return this.http.get(url, { withCredentials: true });
  }

  adhereTester(projectId: number): Observable<any> {
    const url = `${BACK_URL}/api/project/${projectId}/adhere`;
    return this.http.post(url, undefined,{ withCredentials: true });
  }
}
