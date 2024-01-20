import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BugService } from 'src/app/Services/bug.service';
import { UserService } from 'src/app/Services/user.service';

import { AddBugComponent } from '../add-bug/add-bug.component';

import { Bug } from 'src/app/Interfaces/bug';

@Component({
  selector: 'app-bug-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, AddBugComponent],
  template: `
    <app-add-bug [bug]="bug" *ngIf="bugService.isCardOpen"></app-add-bug>

    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ bug.commit }}</mat-card-title>
        <span class="spacer"></span>
        <div
          *ngIf="isAssignedBug; then isAssignedBlock; else isNotAssignedBlock"
        ></div>
        <ng-template #isNotAssignedBlock>
          <button mat-raised-button color="primary" (click)="assignBug()">
            Preia Bug
          </button>
        </ng-template>
        <ng-template #isAssignedBlock>
          <button
            mat-raised-button
            color="primary"
            (click)="bugService.toogleCard()"
          >
            Marcheaza rezolvat
          </button>
        </ng-template>
      </mat-card-header>
      <mat-card-content>
        <div class="card-field">
          <h1 class="card-text">Descriere</h1>
          <p class="card-text  bug-description">{{ bug.description }}</p>
        </div>
        <div class="card-field">
          <h1 class="card-text">Severitate</h1>
          <p class="card-text">{{ bug.severity }}</p>
        </div>
        <div class="card-field">
          <h1 class="card-text">Prioritate</h1>
          <p class="card-text">{{ bug.priority }}</p>
        </div>
        <div class="card-field">
          <h1 class="card-text">Referinta Commit</h1>
          <a [href]="bug.commit" class="card-text">{{ bug.commit }}</a>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./bug-card.component.css'],
})
export class BugCardComponent {
  @Input() bug!: Bug;
  isAssignedBug: boolean = false;

  constructor(
    protected bugService: BugService,
    private userService: UserService
  ) {}

  assignBug() {
    this.isAssignedBug = true;

    this.bugService.assignBug(this.bug.id!).subscribe({
      next: (value) => {
        window.location.reload();
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {
        console.log('Observable emitted the complete notification');
      },
    });
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.bugService.getBugById(this.bug.id!).subscribe({
          next: (bug) => {
            if (bug.userId === user.id) {
              this.isAssignedBug = true;
            }
          },
          error: (err) => console.error('Observable emitted an error: ' + err),
          complete: () => {
            console.log('Observable emitted the complete notification');
          },
        });
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {
        console.log('Observable emitted the complete notification');
      },
    });
  }
}
