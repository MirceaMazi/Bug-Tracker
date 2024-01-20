import { Injectable } from '@angular/core';
import { ProjectPost } from '../Interfaces/project';
import { BACK_URL } from 'src/const';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  isCardOpen: boolean = false;

  toogleCard() {
    this.isCardOpen = !this.isCardOpen;
  }

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    const url = `${BACK_URL}/api/project`;
    return this.http.get(url, { withCredentials: true });
  }

  getProjectById(projectId: number): Observable<any> {
    const url = `${BACK_URL}/api/project/${projectId}`;
    return this.http.get(url, { withCredentials: true });
  }

  createProject(project: ProjectPost): Observable<any> {
    const url = `${BACK_URL}/api/project`;
    return this.http.post(url, project, { withCredentials: true });
  }
}
