import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private atoken: string;
  private curUser = new Subject<any>();
  private cUser;
  public authStatus = new Subject<boolean>();
  private isLog: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  setCurUserInfo(): Observable<any> {
    return this.http.get('http://localhost:3000/api/user/getCurUserInfo');
  }

  getUser() {
    return this.cUser;
  }

  loginUser(email: string, password: string) {
    const user = { email: email, password: password };
    this.http
      .post<{ token: string; user: any }>(
        'http://localhost:3000/api/user/login',
        user
      )
      .subscribe(result => {
        const token = result.token;
        this.atoken = token;
        if (this.atoken) {
          this.isLog = true;
          this.authStatus.next(true);
          this.cUser = result.user;
          this.saveAuthData(token);
          if (this.cUser.post === 'manager') {
            this.router.navigate(['/manager']);
          } else if (this.cUser.post === 'employee') {
            this.router.navigate(['/employee']);
          }
        }
      });
  }

  saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }

  createUser(email: string, name: string, password: string, post: string) {
    const user = { name: name, email: email, password: password, post: post };
    console.log(user);
    this.http
      .post('http://localhost:3000/api/user/signup', user)
      .subscribe(result => {
        console.log(result);
      });
  }

  getToken() {
    return this.atoken;
  }
}
