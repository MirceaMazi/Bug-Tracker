import { Injectable } from '@angular/core';
import { BACK_URL } from 'src/const';
import { Bug } from '../Interfaces/bug';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  isCardOpen: boolean = false;

  toogleCard() {
    this.isCardOpen = !this.isCardOpen;
  }

  createBug(bug: Bug, projectId: number): Observable<any> {
    const url = `${BACK_URL}/api/bug/project/${projectId}`;
    return this.http.post(url, bug, { withCredentials: true });
  }

  assignBug(bugId: number): Observable<any> {
    const url = `${BACK_URL}/api/bug/${bugId}`;
    return this.http.post(url, undefined, { withCredentials: true });
  }

  resolveBug(bugId: number, resolveCommit: string): Observable<any> {
    const url = `${BACK_URL}/api/bug/${bugId}/resolve`;
    return this.http.post(url, { resolveCommit }, { withCredentials: true });
  }

  getBugById(bugId: number): Observable<any> {
    const url = `${BACK_URL}/api/project/${bugId}`;
    return this.http.get(url, { withCredentials: true });
  }

  constructor(private http: HttpClient) {}
}
