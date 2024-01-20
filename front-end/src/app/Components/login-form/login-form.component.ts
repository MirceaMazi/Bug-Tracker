import { Component, DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Route, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { LoginService } from 'src/app/Services/login.service';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/Services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <form class="form-wrapper">
      <!-- Rendering the signup/login form dinamically
      inside the same component -->

      <div *ngIf="existingUser; then loginForm; else signupForm"></div>

      <!-- -------------Login----------------- -->
      <ng-template #loginForm>
        <div class="login-form">
          <h2 class="form-text">Formular de logare</h2>
          <mat-form-field appearance="outline">
            <mat-label>Nume utilizator</mat-label>
            <input
              type="text"
              [formControl]="email"
              matInput
              placeholder="Nume Prenume"
              required
              #emailInput
            />
            <mat-error *ngIf="email.invalid && (email.dirty || email.touched)">
              <span *ngIf="email.errors?.['required']">Email is required.</span>
              <span *ngIf="email.errors?.['email']">Email is invalid</span>
            </mat-error>

            <mat-hint>Fara diacritice</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Parola</mat-label>
            <input
              type="password"
              [formControl]="password"
              matInput
              required
              #passwordInput
            />
            <mat-error
              *ngIf="password.invalid && (password.dirty || password.touched)"
            >
              <span *ngIf="password.errors?.['required']"
                >Password is required.</span
              >
              <span *ngIf="password.errors?.['minlength']"
                >At least 8 characters</span
              >
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            (click)="loginUser(emailInput.value, passwordInput.value, $event)"
          >
            Logheaza-te
          </button>

          <a
            href=""
            class="form-text"
            id="new-account"
            (click)="existingUser = !existingUser"
            >N-ai cont?👉👈😳</a
          >
        </div>
      </ng-template>

      <!-- -------------Signup----------------- -->

      <ng-template #signupForm>
        <div class="login-form">
          <h2 class="form-text">Formular de inregistrare</h2>
          <mat-form-field appearance="outline">
            <mat-label>Nume utilizator</mat-label>
            <input
              type="text"
              [formControl]="username"
              matInput
              placeholder="Nume Prenume"
              required
              #usernameInput
            />
            <mat-error *ngIf="username.dirty || username.touched">
              <span *ngIf="username.errors?.['required']"
                >Username is required.</span
              >
              <span *ngIf="username.errors?.['minlength']"
                >At least 8 characters</span
              >
            </mat-error>

            <mat-hint>Fara diacritice</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input
              type="email"
              [formControl]="email"
              matInput
              placeholder="exemplu@email.ro"
              required
              #emailInput
            />
            <mat-error *ngIf="email.invalid && (email.dirty || email.touched)">
              <span *ngIf="email.errors?.['required']">Email is required.</span>
              <span *ngIf="email.errors?.['email']">Email is invalid</span>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Parola</mat-label>
            <input
              type="password"
              [formControl]="password"
              matInput
              required
              #passwordInput
            />
            <mat-error
              *ngIf="password.invalid && (password.dirty || password.touched)"
            >
              <span *ngIf="password.errors?.['required']"
                >password is required.</span
              >
              <span *ngIf="password.errors?.['minlength']"
                >At least 8 characters</span
              >
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            (click)="
              addUser(
                usernameInput.value,
                passwordInput.value,
                emailInput.value
              )
            "
          >
            Inregistreaza-te
          </button>

          <p
            class="form-text"
            id="new-account"
            (click)="existingUser = !existingUser"
          >
            Ba da, am😤
          </p>
        </div>
      </ng-template>
    </form>
  `,
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  existingUser: boolean = true;
  users: User[] = new Array();

  username = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private http: HttpClient,
    private login: LoginService,
    private userService: UserService,
    private router: Router
  ) {}

  newUser: User = {
    username: '',
    email: '',
    password: '',
  };

  sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loginUser(email: string, password: string, event: Event) {
    event.preventDefault();
    await this.sleep(2000);

    if (this.email.valid && this.password.valid) {
      this.newUser.email = email;
      this.newUser.password = password;

      this.login.loginUser(this.newUser).subscribe({
        complete: () => {
          console.log('User adaugat in baza de date');
        },
        error: (e) => {
          console.log(e);
        },
        next: (response: any) => {
          console.log(response);
          this.router.navigate(['/main']);
        },
      });
    }
  }

  addUser(username: string, password: string, email?: String) {
    if (this.username.valid && this.password.valid && this.email.valid) {
      this.newUser.username = username;
      this.newUser.email = email;
      this.newUser.password = password;

      this.login.addUser(this.newUser).subscribe({
        complete: () => {
          console.log('User adaugat in baza de date');
        },
        error: (e) => {
          console.log(e);
        },
        next: (response: any) => {
          console.log(response);
        },
      });
    } else {
      alert('Form invalid sau username deja existent');
    }
  }
}
