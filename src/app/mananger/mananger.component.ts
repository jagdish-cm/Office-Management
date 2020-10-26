import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { async } from 'q';

@Component({
  selector: 'app-mananger',
  templateUrl: './mananger.component.html',
  styleUrls: ['./mananger.component.scss']
})
export class ManangerComponent implements OnInit {
  tasks;
  employees;
  loadedData: boolean = false;
  selectedTask;
  selectedTaskProgress = [];
  value: number = 50;
  ctasks = [];
  ltasks = [];
  otasks = [];
  displayModal: boolean;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(result => {
      this.tasks = result.tasks;
      this.taskService.getEmployees().subscribe(emps => {
        this.employees = emps.employees;
        this.setInfo().then(newTasks => {
          console.log(newTasks);
          let l = newTasks.length;
          for (let i = 0; i < l; i++) {
            let avgProg = 0;
            let pl = newTasks[i].employeeProgress.length;
            for (let j = 0; j < pl; j++) {
              avgProg += newTasks[i].employeeProgress[j].progress;
            }
            avgProg = avgProg / pl;
            console.log('Average progress ' + avgProg);
            let d1 = newTasks[i].deadline;
            let deadline = new Date(d1);
            console.log(typeof deadline + deadline);
            let date = new Date();
            if (deadline > date && avgProg < 100) {
              this.otasks.push(newTasks[i]);
            } else if (deadline < date && avgProg < 100) {
              this.ltasks.push(newTasks[i]);
            } else if (deadline > date && avgProg === 100) {
              this.ctasks.push(newTasks[i]);
            }
          }
        });
      });
    });
  }

  async setInfo() {
    console.log('imhere' + this.tasks.length);
    let tl = this.tasks.length;
    for (var i = 0; i < tl; i++) {
      var empsInfo = [];
      console.log('not 3 here');
      let eil = this.tasks[i].employeeIds.length;
      for (var j = 0; j < eil; j++) {
        console.log('2 here');
        let el = this.employees.length;
        for (var k = 0; k < el; k++) {
          console.log('not here');
          if (this.tasks[i].employeeIds[j] === this.employees[k]._id) {
            var obj = {};
            console.log('here');
            obj[this.employees[k]._id] = this.employees[k].name;
            empsInfo.push(obj);
          }
        }
      }
      this.tasks[i]['empNames'] = empsInfo;
    }
    return this.tasks;
  }

  createTask() {
    this.router.navigate(['manager/createTask']);
  }

  editTask() {
    this.taskService.editTask = this.selectedTask;
    this.router.navigate(['manager/createTask']);
  }

  showModalDialog(task) {
    this.selectedTaskProgress = [];
    console.log(task);
    this.selectedTask = task;
    let pl = this.selectedTask.employeeProgress.length;
    //empProgress
    for (let i = 0; i < pl; i++) {
      let obj = {};
      obj['progress'] = this.selectedTask.employeeProgress[i].progress;
      obj['note'] = this.selectedTask.employeeProgress[i].note;
      //empNames
      for (let j = 0; j < pl; j++) {
        console.log(j);
        if (
          this.selectedTask.empNames[j].hasOwnProperty(
            this.selectedTask.employeeProgress[i]._id
          )
        ) {
          console.log(this.selectedTask);
          let id = this.selectedTask.employeeProgress[i]._id;
          obj['name'] = this.selectedTask.empNames[j][id];
          break;
        }
      }
      this.selectedTaskProgress.push(obj);
    }
    console.log(this.selectedTaskProgress);
    this.displayModal = true;
  }
}
