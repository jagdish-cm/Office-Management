import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ManangerComponent } from '../mananger/mananger.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  cUser;
  public editTask: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getEmployees(): Observable<any> {
    return this.http.get(
      'http://localhost:3000/api/user/employees/' + this.cUser.post
    );
  }

  getTasks(): Observable<any> {
    this.cUser = this.authService.getUser();
    if (this.cUser) {
      return this.http.get('http://localhost:3000/api/task/' + this.cUser._id);
    }
  }

  updateTask(
    taskid: string,
    manager: string,
    title: string,
    deadline: Date,
    emps: any
  ): Observable<any> {
    let empProgress = [];
    console.log('in update');
    for (let i = 0; i < emps.length; i++) {
      var obj = {
        _id: emps[i],
        note: '',
        progress: 0
      };
      empProgress.push(obj);
    }
    let newtask = {
      taskid: taskid,
      manager: manager,
      title: title,
      deadline: deadline,
      empProgress: empProgress,
      emps: emps
    };
    console.log(newtask);
    return this.http.put('http://localhost:3000/api/task/edit', newtask);
  }

  createTask(manager: string, title: string, deadline: Date, emps: any) {
    let empProgress = [];
    console.log('in create');
    for (let i = 0; i < emps.length; i++) {
      var obj = {
        _id: emps[i],
        note: '',
        progress: 0
      };
      empProgress.push(obj);
    }
    let task = {
      manager: manager,
      title: title,
      deadline: deadline,
      empProgress: empProgress,
      emps: emps
    };

    console.log(task);
    return this.http
      .post('http://localhost:3000/api/task/create', task)
      .subscribe(result => {
        console.log(result);
        if (result) {
          this.router.navigate(['/manager']);
        }
      });
  }

  submitProgress(
    taskid: string,
    eid: string,
    note: string,
    progress: number
  ): Observable<any> {
    let prog = {
      taskid: taskid,
      eid: eid,
      note: note,
      progress: progress
    };
    console.log(prog);
    return this.http.post('http://localhost:3000/api/task/progress', prog);
  }
}
