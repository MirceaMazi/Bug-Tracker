import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from 'src/app/Services/project.service';
import { BugService } from 'src/app/Services/bug.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ProjectGet } from 'src/app/Interfaces/project';
import { Bug } from 'src/app/Interfaces/bug';

@Component({
  selector: 'app-add-bug',
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
          >Marcheaza bug-ul ca rezolvat</mat-card-title
        >

        <button
          mat-raised-button
          id="exit-btn"
          class="form-text"
          (click)="bugService.toogleCard()"
        >
          X
        </button>
      </mat-card-header>

      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Commit rezolvare</mat-label>
          <input matInput [formControl]="resolvedCommit" required />
          <mat-error
            *ngIf="
              resolvedCommit?.invalid &&
              (resolvedCommit?.dirty || resolvedCommit?.touched)
            "
          >
            <span *ngIf="resolvedCommit?.errors?.['required']"
              >Please provide a commit link</span
            >
          </mat-error>
        </mat-form-field>

        <button
          mat-raised-button
          id="exit-btn"
          class="form-text"
          (click)="resolveBug()"
        >
          Adauga rezolvare
        </button>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./add-bug.component.css'],
})
export class AddBugComponent {
  @Input() bug!: Bug;

  constructor(
    protected projectService: ProjectService,
    protected bugService: BugService
  ) {}

  resolvedCommit = new FormControl('', Validators.required);

  resolveBug() {
    this.bugService
      .resolveBug(this.bug.id!, this.resolvedCommit.value!)
      .subscribe({
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
