import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  tasks;
  displayModal: boolean;
  selectedTask;
  val2;
  employees;
  ctasks = [];
  ltasks = [];
  otasks = [];
  cUser;
  taskReportForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cUser = this.authService.getUser();
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(result => {
      this.tasks = result.tasks;
      this.taskService.getEmployees().subscribe(emps => {
        this.employees = emps.employees;
        this.setManager()
          .then(newTasks => {
            let tl = newTasks.length;
            this.tasks = newTasks;
            for (let i = 0; i < tl; i++) {
              let progress = newTasks[i].employeeProgress;
              let mp;
              let pl = progress.length;
              for (let j = 0; j < pl; j++) {
                if (progress[j]._id === this.cUser._id) {
                  mp = progress[j].progress;
                  break;
                }
              }
              let d1 = newTasks[i].deadline;
              let deadline = new Date(d1);
              console.log(typeof deadline + deadline);
              let date = new Date();
              console.log(typeof date + date);

              if (deadline > date && mp < 100) {
                this.otasks.push(newTasks[i]);
              } else if (deadline < date && mp < 100) {
                this.ltasks.push(newTasks[i]);
              } else if (deadline > date && mp === 100) {
                this.ctasks.push(newTasks[i]);
              }
            }
          })
          .then(() => {
            console.log(this.otasks);
            console.log(this.ctasks);
            console.log(this.ltasks);
          });
      });
    });
    this.taskReportForm = this.fb.group({
      taskid: ['', Validators.required],
      eid: [this.cUser._id, Validators.required],
      note: ['', Validators.required],
      progress: ['', Validators.required]
    });
  }

  async setManager() {
    let tl = this.tasks.length;
    for (let i = 0; i < tl; i++) {
      let mgrid = this.tasks[i].manager;
      console.log(this.employees);
      let el = this.employees.length;
      for (let j = 0; j < el; j++) {
        if (mgrid === this.employees[j]._id) {
          this.tasks[i]['managerName'] = this.employees[j].name;
          break;
        }
      }
    }
    return this.tasks;
  }

  submitTaskProgress() {
    this.taskReportForm.controls['taskid'].setValue(this.selectedTask._id);
    this.taskReportForm.controls['progress'].setValue(this.val2);
    for (const i in this.taskReportForm.controls) {
      this.taskReportForm.controls[i].markAsDirty();
      this.taskReportForm.controls[i].updateValueAndValidity();
    }
    this.taskService
      .submitProgress(
        this.taskReportForm.value.taskid,
        this.taskReportForm.value.eid,
        this.taskReportForm.value.note,
        this.taskReportForm.value.progress
      )
      .subscribe(res => {
        console.log(res);
      });
    this.taskReportForm.reset();
    this.val2 = null;
    this.displayModal = false;
  }

  showModalDialog(i: number) {
    console.log(i);
    this.selectedTask = this.tasks[i];
    console.log(this.selectedTask);
    this.displayModal = true;
  }
}
