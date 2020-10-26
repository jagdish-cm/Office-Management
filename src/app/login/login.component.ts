import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  post: string;
  password: string;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      post: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [this.confirmValidator]],
      name: ['', Validators.required]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

  submitRegister() {
    this.registerForm.controls['post'].setValue(this.post);
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    console.log(this.registerForm);
    if (this.registerForm.status === 'VALID') {
      this.authService.createUser(
        this.registerForm.value.email,
        this.registerForm.value.name,
        this.registerForm.value.password,
        this.registerForm.value.post
      );
    }
  }

  submitLogin() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
}
