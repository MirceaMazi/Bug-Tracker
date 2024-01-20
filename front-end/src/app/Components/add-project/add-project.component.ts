import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ProjectService } from 'src/app/Services/project.service';
import { UserService } from 'src/app/Services/user.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ProjectPost } from 'src/app/Interfaces/project';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `
    <mat-card class="project-form">
      <mat-card-header>
        <mat-card-title class="form-text"
          >Adauga detalii proiect</mat-card-title
        >

        <button
          mat-raised-button
          id="exit-btn"
          class="form-text"
          (click)="projectService.toogleCard()"
        >
          X
        </button>
      </mat-card-header>

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Denumire proiect</mat-label>
            <input
              required
              matInput
              placeholder="Proiect exemplu"
              formControlName="projectName"
            />
            <mat-error
              *ngIf="
                projectForm.get('projectName')?.invalid &&
                (projectForm.get('projectName')?.dirty ||
                  projectForm.get('projectName')?.touched)
              "
            >
              <span *ngIf="projectForm.get('projectName')?.errors?.['required']"
                >Project name is required.</span
              >
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Users</mat-label>
            <mat-select
              formControlName="Users"
              multiple
              [(ngModel)]="selectedUsers"
            >
              <mat-hint class="form-text"
                >User-ul tau este adaugat automat</mat-hint
              >
              <mat-select-trigger>
                {{projectForm.get('Users')?.value?.[0] || ''}}

                <span
                  *ngIf="(projectForm.get('Users')?.value?.length || 0) > 1"
                  class="additional-selection"
                >
                  +{{ (projectForm.get('Users')?.value?.length || 0) - 1 }}
                  {{
                    projectForm.get('Users')?.value?.length === 2
                      ? 'other'
                      : 'others'
                  }}
                </span>
              </mat-select-trigger>
              <mat-option *ngFor="let user of userList" [value]="user">{{
                user.username
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Descriere proiect</mat-label>
            <textarea matInput formControlName="Descriere"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Repository proiect</mat-label>
            <input
              matInput
              placeholder="exemplu.github.io/Proiect/"
              formControlName="projectRepo"
            />
            <mat-error
              *ngIf="
                projectForm.get('projectRepo')?.invalid &&
                (projectForm.get('projectRepo')?.dirty ||
                  projectForm.get('projectRepo')?.touched)
              "
            >
              <span *ngIf="projectForm.get('projectRepo')?.errors?.['required']"
                >Project repo is required.</span
              >
            </mat-error>
          </mat-form-field>

          <button
            type="submit"
            [disabled]="!projectForm.valid"
            mat-raised-button
            color="primary"
          >
            Adauga noul tau proiect
          </button>
        </mat-card-content>
      </form>
    </mat-card>
  `,
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  constructor(
    protected projectService: ProjectService,
    private userService: UserService
  ) {}

  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectRepo: new FormControl('', [Validators.required]),
    Descriere: new FormControl(''),
    Users: new FormControl(''),
  });

  selectedUsers: string[] = [];

  onSubmit() {
    if (this.projectForm.valid) {
      const newProject: ProjectPost = {
        name: this.projectForm.value.projectName || '',
        repository: this.projectForm.value.projectRepo || '',
        description: this.projectForm.value.Descriere || '',
        members: this.selectedUsers.map((user: any) => user.id),
      };

      this.projectService.createProject(newProject).subscribe({
        next: (value) => {
          console.log('Observable emitted the next value: ' + value);
        },
        error: (err) => console.error('Observable emitted an error: ' + err),
        complete: () => {
          this.projectService.toogleCard();
          window.location.reload();
        },
      });
    }
  }

  userList: any[] = [];

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (value) => {
        this.userList = value.map((user: User) => {
          return { id: user.id, username: user.username };
        });
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {},
    });
  }
}
