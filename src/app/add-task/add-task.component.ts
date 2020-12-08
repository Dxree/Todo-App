import {Component, OnInit} from '@angular/core';
import {Task} from '../task.model';
import {TaskService} from '../task.service';
import {CategoryService} from '../category.service';
import {GetListComponent} from '../get-list/get-list.component';
import * as firebase from 'firebase';
import {UserService} from '../user.service';
import {Category} from '../category.model';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {

  newTask: Task;
  deadline: string;
  username: string;
  allCategories: Category[];


  constructor(private taskService: TaskService, private getListComponent: GetListComponent,
              private userService: UserService, private categoryService: CategoryService) {
    this.deadline = null;
    this.newTask = {
      title: '',
      description: '',
      priority: 3,
      done: false,
      categories: [null],
    };
  }

  async ngOnInit() {
    await this.userService.getCurrentUser().then(res => this.username = res.username);
    await this.categoryService.getAllCategories(this.username).then(res => this.allCategories = res);
  }

  cancel() {
    document.getElementById('app-add-task').style.display = 'none';
    document.getElementById('btn-add-task').style.display = 'block';
    document.getElementById('btn-add-category').style.display = 'block';
    this.resetTask();
  }

  async confirm() {
    if (this.newTask.title.length === 0) {
      this.showWarning('Die Aufgabe muss einen Titel haben.');
      return;
    }
    console.log('ok1');
    if (this.deadline != null) {
      const deadlineDate: Date = new Date(Date.parse(this.deadline));
      this.newTask.deadline = firebase.firestore.Timestamp.fromDate(deadlineDate);
    }
    console.log('ok2');
    await this.taskService.addTask(this.username, this.newTask);
    await this.getListComponent.filter();
    console.log('ok3');
    this.resetTask();
    document.getElementById('app-add-task').style.display = 'none';
    document.getElementById('btn-add-task').style.display = 'block';
    document.getElementById('btn-add-category').style.display = 'block';
  }

  resetTask() {
    this.newTask = {
      title: '',
      description: '',
      priority: 3,
      done: false,
      categories: [null]
    };
  }

  showWarning(warning: string) {
    alert(warning);
  }


  getAllCategories() {
    return this.categoryService.allCategories;
  }

}


