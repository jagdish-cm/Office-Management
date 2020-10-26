import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  createTaskForm: FormGroup;
  employees;
  editEmpNames = [];
  editTask: any;
  editarray: number = 0;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {
    taskService.getEmployees().subscribe(result => {
      this.employees = result.employees;
    });
  }

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      deadline: ['', Validators.required],
      employees: this.fb.array([], [Validators.required])
    });
    if (this.taskService.editTask) {
      this.editTask = this.taskService.editTask;
      this.createTaskForm.controls['title'].setValue(this.editTask.title);
      let emps = this.editTask.employeeIds;
      let empidname = this.editTask.empNames;
      const checkArray: FormArray = this.createTaskForm.get(
        'employees'
      ) as FormArray;
      console.log(this.editTask);
      console.log(this.employees);
      let el = emps.length;
      for (let i = 0; i < el; i++) {
        checkArray.push(new FormControl(emps[i]));
      }
      for (let i = 0; i < el; i++) {
        for (let j = 0; j < el; j++) {
          if (empidname[j].hasOwnProperty(emps[i])) {
            this.editEmpNames.push(empidname[j][emps[i]]);
          }
        }
      }
      console.log(this.editEmpNames);
    }
    this.taskService.editTask = null;
  }

  addEmployee(e: any) {
    const checkArray: FormArray = this.createTaskForm.get(
      'employees'
    ) as FormArray;

    if (this.editarray === 0) {
      while (checkArray.length != 0) {
        checkArray.removeAt(0);
      }
      this.editarray++;
    }

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(this.createTaskForm.controls);
  }

  updateTask() {
    this.taskService
      .updateTask(
        this.editTask._id,
        this.editTask.manager,
        this.createTaskForm.value.title,
        this.createTaskForm.value.deadline,
        this.createTaskForm.value.employees
      )
      .subscribe(result => {
        this.editTask = null;
        console.log(result);
        if (result) {
          this.router.navigate(['/manager']);
        }
      });
  }

  createTask() {
    for (const i in this.createTaskForm.controls) {
      this.createTaskForm.controls[i].markAsDirty();
      this.createTaskForm.controls[i].updateValueAndValidity();
    }
    if (this.editTask) {
      this.updateTask();
    } else {
      console.log(this.createTaskForm);
      this.taskService.createTask(
        this.authService.getUser()._id,
        this.createTaskForm.value.title,
        this.createTaskForm.value.deadline,
        this.createTaskForm.value.employees
      );
    }
  }
}
