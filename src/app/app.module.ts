import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';

import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManangerComponent } from './mananger/mananger.component';
import { EmployeeComponent } from './employee/employee.component';
import { CreateTaskComponent } from './mananger/create-task/create-task.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'manager',
    children: [
      { path: '', component: ManangerComponent },
      { path: 'createTask', component: CreateTaskComponent }
    ]
  },
  { path: 'employee', component: EmployeeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ManangerComponent,
    EmployeeComponent,
    CreateTaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    HttpClientModule,
    CalendarModule,
    CheckboxModule,
    EditorModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    SliderModule,
    RouterModule,
    ProgressBarModule,
    DialogModule,
    RouterModule.forRoot(routes),
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
