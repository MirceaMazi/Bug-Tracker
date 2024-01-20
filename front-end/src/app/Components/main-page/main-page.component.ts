import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from 'src/app/Services/project.service';

import { ProjectCardComponent } from '../project-card/project-card.component';
import { AddProjectComponent } from '../add-project/add-project.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Interfaces/user';

import { MatButtonModule } from '@angular/material/button';
import { ProjectGet } from 'src/app/Interfaces/project';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatButtonModule,
    ProjectCardComponent,
    RouterModule,
    AddProjectComponent,
  ],
  template: `
    <div class="main-container">
      <app-navbar></app-navbar>

      <app-add-project *ngIf="projectService.isCardOpen"></app-add-project>

      <button
        mat-raised-button
        color="primary"
        id="new-project-btn"
        (click)="projectService.toogleCard()"
      >
        Adauga proiect
      </button>

      <div class="projects-container">
        <app-project-card
          *ngFor="let project of projects"
          [project]="project"
        ></app-project-card>
      </div>
    </div>
  `,
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
  };

  projects: ProjectGet[] = [];

  constructor(
    private userService: UserService,
    protected projectService: ProjectService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;

    this.projectService.getProjects().subscribe({
      next: (value) => {
        console.log('Observable emitted the next value: ' + value);
        this.projects = value;
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () =>
        console.log('Observable emitted the complete notification'),
    });
  }
}
