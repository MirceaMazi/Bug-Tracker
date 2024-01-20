import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { User } from '../Interfaces/user';
import { BACK_URL } from 'src/const';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<any> {
    const url = `${BACK_URL}/api/auth/register`;
    return this.http.post(url, user);
  }

   loginUser(user: User): Observable<any> {
    const url = `${BACK_URL}/api/auth/login`;
    return this.http.post(url, user, { withCredentials: true });
  }

  

  logoutUser(): Observable<any> {
    const url = `${BACK_URL}/api/auth/logout`;
    return this.http.post(url, undefined, { withCredentials: true });
  }
}
