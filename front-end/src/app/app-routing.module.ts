import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { ProjectDetailsComponent } from './Components/project-details/project-details.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'main', component: MainPageComponent },
  { path: 'details/:id', component: ProjectDetailsComponent },
  { path: '**', redirectTo: 'main' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
