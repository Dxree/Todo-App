import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {TaskService} from './task.service';
import {CategoryService} from './category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Todo-List';

  constructor() {
  }

  ngOnInit() {
  }

}
