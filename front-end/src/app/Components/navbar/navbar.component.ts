import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from 'src/app/Interfaces/user';

import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <span class="product-name">TechOps</span>
      <span class="spacer"></span>
      <button mat-raised-button (click)="logout()">Log Out</button>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() user!: User;

  constructor(private router: Router, private loginService: LoginService) {}

  logout() {
    this.loginService.logoutUser().subscribe({
      next: (value) => {
        console.log('Observable emitted the next value: ' + value);
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Observable emitted an error: ' + err),
      complete: () => {
        console.log('Observable emitted the complete notification');
      },
    });
  }
}
