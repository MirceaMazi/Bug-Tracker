import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AddBugComponent } from '../add-bug/add-bug.component';
import { BugCardComponent } from '../bug-card/bug-card.component';

import { BugService } from 'src/app/Services/bug.service';
import { UserService } from 'src/app/Services/user.service';

import { ProjectGet } from 'src/app/Interfaces/project';
import { Bug } from 'src/app/Interfaces/bug';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from 'src/app/Services/project.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AddBugComponent,
    BugCardComponent,
  ],
  template: `
    <div class="details-container">
      <app-navbar></app-navbar>

      <mat-tab-group>
        <mat-tab label="Detalii proiect">
          <!-- This is for the general details tab -->

          <mat-card class="details-card ">
            <mat-card-header>
              <mat-card-title class="details-text">{{
                project.name
              }}</mat-card-title>
              <button
                [routerLink]="['/main']"
                mat-raised-button
                background-color="basic"
              >
                Pagina anterioara
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="details-field">
                <h1 class="details-text">Descriere proiect</h1>
                <p class="details-text">{{ project.description }}</p>
              </div>
              <div class="details-field">
                <h1 class="details-text">Membri proiect</h1>
                <p class="details-text">{{ usernames }}</p>
              </div>
              <div class="details-field">
                <h1 class="details-text">Repository proiect</h1>
                <a [href]="project.repository" class="details-text">{{
                  project.repository
                }}</a>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        <mat-tab *ngIf="isMember" label="Actiuni suplimentare">
          <!-- This is for all the actions the members can do -->

          <mat-card class="details-card">
            <mat-card-header>
              <mat-card-title class="details-text">{{
                project.name
              }}</mat-card-title>
              <button
                [routerLink]="['/main']"
                mat-raised-button
                background-color="basic"
              >
                Pagina anterioara
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="details-field">
                <app-bug-card
                  *ngFor="let bug of project.bugs"
                  [bug]="bug"
                ></app-bug-card>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        <mat-tab *ngIf="isTester" label="Testare">
          <!-- This is for all the actions the testers can do -->

          <mat-card class="details-card">
            <mat-card-header>
              <mat-card-title class="details-text">{{
                project.name
              }}</mat-card-title>
              <button
                [routerLink]="['/main']"
                mat-raised-button
                background-color="basic"
              >
                Pagina anterioara
              </button>
            </mat-card-header>
            <mat-card-content>
              <div
                *ngIf="
                  isTstOnProject;
                  then isOnProjectBlock;
                  else isNotOnProjectBlock
                "
              ></div>
              <ng-template #isNotOnProjectBlock>
                <div class="details-field">
                  <h1 class="details-text">
                    Momentan nu faci parte din echipa de testare a proiectului
                  </h1>
                  <button
                    mat-raised-button
                    background-color="basic"
                    (click)="changeTstStatus()"
                  >
                    Devino tester
                  </button>
                </div>
              </ng-template>
              <ng-template #isOnProjectBlock>
                <div class="details-field">
                  <h1 class="details-text">
                    Inregistreaza un nou bug descoperit
                  </h1>
                  <form [formGroup]="bugForm" (ngSubmit)="onSubmit()">
                    <mat-form-field>
                      <mat-label>Severitatea bug-ului</mat-label>
                      <mat-select required formControlName="bugSeverity">
                        <mat-option
                          *ngFor="let severity of bugStatusOptions"
                          [value]="severity"
                          >{{ severity }}</mat-option
                        >
                      </mat-select>
                      <mat-error
                        *ngIf="
                          bugForm.get('bugSeverity')?.invalid &&
                          (bugForm.get('bugSeverity')?.dirty ||
                            bugForm.get('bugSeverity')?.touched)
                        "
                      >
                        <span
                          *ngIf="bugForm.get('bugSeverity')?.errors?.['required']"
                          >You have to choose a severity</span
                        >
                      </mat-error>
                    </mat-form-field>
                    <mat-form-field>
                      <mat-label>Prioritatea bug-ului</mat-label>
                      <mat-select required formControlName="bugPriority">
                        <mat-option
                          *ngFor="let priority of bugStatusOptions"
                          [value]="priority"
                          >{{ priority }}</mat-option
                        >
                      </mat-select>
                      <mat-error
                        *ngIf="
                          bugForm.get('bugPriority')?.invalid &&
                          (bugForm.get('bugPriority')?.dirty ||
                            bugForm.get('bugPriority')?.touched)
                        "
                      >
                        <span
                          *ngIf="bugForm.get('bugPriority')?.errors?.['required']"
                          >You have to choose a priority</span
                        >
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Descriere bug</mat-label>
                      <textarea
                        matInput
                        formControlName="bugDescription"
                        required
                      ></textarea>
                      <mat-error
                        *ngIf="
                          bugForm.get('bugPriority')?.invalid &&
                          (bugForm.get('bugPriority')?.dirty ||
                            bugForm.get('bugPriority')?.touched)
                        "
                      >
                        <span
                          *ngIf="bugForm.get('bugPriority')?.errors?.['required']"
                          >Please provide a description</span
                        >
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Commit bug</mat-label>
                      <input
                        matInput
                        placeholder="a3f8e7b8c9d0b3a2d1e4f5a6b7c8d9e0f1a2b3c4"
                        formControlName="bugCommit"
                      />
                      <mat-error
                        *ngIf="
                          bugForm.get('bugCommit')?.invalid &&
                          (bugForm.get('bugCommit')?.dirty ||
                            bugForm.get('bugCommit')?.touched)
                        "
                      >
                        <span
                          *ngIf="bugForm.get('bugCommit')?.errors?.['required']"
                          >The commit of the bug is required</span
                        >
                      </mat-error>
                    </mat-form-field>

                    <button
                      type="submit"
                      [disabled]="!bugForm.valid"
                      mat-raised-button
                      background-color="basic"
                    >
                      Inregistreaza bug-ul
                    </button>
                  </form>
                </div>
              </ng-template>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent {
  project!: ProjectGet;
  usernames: string[] = [];
  isTester: boolean = false;
  isMember: boolean = false;
  isTstOnProject: boolean = false;

  bugStatusOptions: string[] = ['Low', 'Medium', 'High', 'Critical'];

  bugForm = new FormGroup({
    bugSeverity: new FormControl('', [Validators.required]),
    bugPriority: new FormControl('', [Validators.required]),
    bugDescription: new FormControl('', [Validators.required]),
    bugCommit: new FormControl('', [Validators.required]),
  });

  constructor(
    protected projectService: ProjectService,
    private router: ActivatedRoute,
    protected bugService: BugService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.router.paramMap.subscribe((params) => {
      const projectId = Number(params.get('id'));

      this.projectService.getProjectById(projectId).subscribe({
        next: (value) => {
          this.project = value;
          this.usernames = this.project.users.map((user: any) => user.username);
        },
        error: (err) => console.error('Observable emitted an error: ' + err),
        complete: () => {
          console.log('Observable emitted the complete notification');
        },
      });
    });

    this.userService.getCurrentUser().subscribe({
      next: (value: any) => {
        let role = this.project.users.filter(
          (user: any) => user.id === value.id
        );

        if (role.length !== 0) {
          //@ts-ignore
          let roleString = role[0].attendance.role;

          if (roleString === 'member') {
            this.isMember = true;
            this.isTester = false;
          } else if (roleString === 'tester') {
            this.isMember = false;
            this.isTester = true;
            this.isTstOnProject = true;
          }
        } else {
          this.isMember = false;
          this.isTester = true;
          this.isTstOnProject = false;
        }
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {
        console.log('Observable emitted the complete notification');
      },
    });
  }

  changeTstStatus() {
    this.userService.adhereTester(this.project.id!).subscribe({
      next: (value) => {
        window.location.reload();
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {
        console.log('Observable emitted the complete notification');
      },
    });

    this.isTstOnProject = true;
  }

  onSubmit() {
    if (this.bugForm.valid) {
      const newBug: Bug = {
        severity: this.bugForm.value.bugSeverity || '',
        priority: this.bugForm.value.bugPriority || '',
        description: this.bugForm.value.bugDescription || '',
        commit: this.bugForm.value.bugCommit || '',
      };

      this.bugService.createBug(newBug, this.project.id!).subscribe({
        next: (value) => {
          window.location.reload();
        },
        error: (err) => console.error('Observable emitted an error: ' + err),
        complete: () => {
          console.log('Observable emitted the complete notification');
        },
      });
    }
  }
}
