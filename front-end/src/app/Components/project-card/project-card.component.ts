import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProjectGet } from 'src/app/Interfaces/project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <mat-card>
      <mat-card-content>
        <mat-card-title>{{ project.name }}</mat-card-title>
        <span class="spacer"></span>
        <button
          [routerLink]="['/details', project.id]"
          mat-raised-button
          background-color="basic"
        >
          Detalii proiect
        </button>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent {
  @Input() project!: ProjectGet;
}
