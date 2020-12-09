import {Component, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task.model';

import {UserService} from '../user.service';
import {Category} from '../category.model';
import {CategoryService} from '../category.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-get-list',
  templateUrl: './get-list.component.html',
  styleUrls: ['./get-list.component.css']
})

export class GetListComponent implements OnInit {

  public todoList: Task[];
  public doneList: Task[];
  public categoryList: Category[];
  editableTask: Task;
  editableCategory: Category;
  originalCategoryId: string;
  username: string;
  filterword: string;
  filtercategory: string;

  constructor(private taskService: TaskService, private userService: UserService, private categoryService: CategoryService) {

  }

  async ngOnInit() {
    await this.userService.getCurrentUser().then(res => this.username = res.username);
    await this.filter();
    this.editableTask = {
      id: '',
      title: '',
      description: '',
      priority: 3,
      done: false,
      categories: []
    };
    this.editableCategory = {
      title: ''
    };
  }

  async getAllTasks() {
    await this.taskService.getAllTasks(this.username).then(
      res => {
        this.todoList = res.filter(task => task.done === false);
        this.doneList = res.filter(task => task.done === true);
      }
    );
  }


  getIconClassForPriority(priority: number) {
    switch (priority.toString()) {
      case '1':
        return 'fa-angle-double-down fa-2x';
      case '2':
        return 'fa-angle-down fa-2x';
      case '3':
        return 'fa-bars fa-lg';
      case '4':
        return 'fa-angle-up fa-2x';
      case '5':
        return 'fa-angle-double-up fa-2x';
    }
  }

  showForm() {
    document.getElementById('app-add-task').style.display = 'block';
    document.getElementById('btn-add-task').style.display = 'none';
    document.getElementById('btn-add-category').style.display = 'none';
  }

  showCategoryForm() {
    document.getElementById('app-add-category').style.display = 'block';
    document.getElementById('btn-add-task').style.display = 'none';
    document.getElementById('btn-add-category').style.display = 'none';
  }

  editTask(task: Task) {
    this.editableTask = task;
  }

  editCategory(category: Category) {
    this.originalCategoryId = category.title;
    this.editableCategory = category;
  }

  confirmEdit() {
    this.editableTask.title = document.getElementById(this.editableTask.id + '-title').innerText;
    this.editableTask.description = document.getElementById(this.editableTask.id + '-description').innerText;
    const tmp = document.getElementById(this.editableTask.id + '-deadline').innerText.split('.');
    const deadline = Date.parse(tmp[1] + '.' + tmp[0] + '.' + tmp[2]);
    console.log(deadline);
    if (!isNaN(deadline)) {
      const deadlineDate: Date = new Date(deadline);
      console.log(deadlineDate);
      this.editableTask.deadline = firebase.firestore.Timestamp.fromDate(deadlineDate);
    }
    if (this.editableTask.title.length === 0) {
      alert('Die Aufgabe muss einen Titel haben.');
    } else {
      this.taskService.updateTask(this.username, this.editableTask).then(async () => {
        await this.filter();
      });
    }
  }

  confirmEditCategory() {
    this.editableCategory.title = document.getElementById(this.editableCategory.title + '-title').innerText;
    if (this.editableCategory.title == null) {
      this.editableCategory = null;
    }
    if (this.editableCategory.title.length === 0) {
      alert('Die Kategorie muss einen Titel haben.');
    } else {
      this.categoryService.renameCategory(this.username, this.originalCategoryId, this.editableCategory).then(async () => {
        await this.filter();
      });
    }
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(this.username, task).then(async () => {
      await this.filter();
    });
  }

  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(this.username, category).then(() => this.filter());
  }

  setTaskDone(task: Task) {
    task.done = true;
    this.taskService.updateTask(this.username, task).then(() => this.filter());
  }

  async filter() {
    let todos = [];
    let dones = [];
    await this.taskService.getAllTasks(this.username).then(
      res => {
        todos = res.filter(task => task.done === false);
        dones = res.filter(task => task.done === true);
      }
    );

    await this.getCategoryList();

    if (this.filterword != null && this.filterword.trim().length !== 0) {
      this.todoList = todos.filter(task => this.filterCrit(task.title, task.description, this.filterword));
      this.doneList = dones.filter(task => this.filterCrit(task.title, task.description, this.filterword));
    } else {
      await this.getAllTasks();
    }

    if (this.filtercategory != null) {
      this.todoList = this.filterCategory(this.todoList, this.filtercategory);
      this.doneList = this.todoList;
      this.categoryList = this.categoryList.filter(cat => cat.title === this.filtercategory);
    }
  }

  filterCrit(target1: string, target2: string, search: string): boolean {
    search = search.trim().toLowerCase();
    return target1.trim().toLowerCase().includes(search) || target2.trim().toLowerCase().includes(search);
  }

  filterCategory(tasks: Task[], filter: string) {
    const catTasks: Task[] = [];
    for (const task of tasks) {
      for (const cat of task.categories) {
        if (cat != null) {
          if (cat.title === filter) {
            catTasks.push(task);
          }
        }
      }
    }
    return catTasks;
  }

  async resetFilterCategory() {
    this.filtercategory = null;
    await this.filter();
  }

  async getCategoryList() {
    await this.categoryService.getAllCategories(this.username).then(res => {
      this.categoryList = res;
    });
  }

  getStringForPriority(prio: any): string {
    switch (prio) {
      case 1:
        return 'sehr niedrig';
      case '1':
        return 'sehr niedrig';
      case 2:
        return 'niedrig';
      case '2':
        return 'niedrig';
      case 3:
        return 'mittel';
      case '3':
        return 'mittel';
      case 4:
        return 'hoch';
      case '4':
        return 'hoch';
      case 5:
        return 'sehr hoch';
      case '5':
        return 'sehr hoch';
      default:
        console.log('Still some inconsistency in database');
        return '';
    }
  }
}
