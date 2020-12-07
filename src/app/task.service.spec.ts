import {TestBed} from '@angular/core/testing';
import {firebaseConfig} from './app.module';

import {TaskService} from './task.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {Category} from './category.model';
import Timestamp = firebase.firestore.Timestamp;
import { Task } from './task.model';

describe('TaskService', () => {

  const testUsername = 'user-for-taskService-test';
  const categoryModel: Category = {
    title: 'kms'
  };
  const taskModel: Task = {
    title: 'create more Tasks',
    description: '...',
    done: false,
    priority: 3,
    categories: [categoryModel],
    deadline: Timestamp.fromDate(new Date(2020, 12, 24))
  };
  let service: TaskService;
  let userCollectionRef;
  let userTaskRef;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule
      ],
      providers: [
        AngularFirestore
      ]
    });
    service = TestBed.get(TaskService);
    userCollectionRef = firebase.firestore().collection('users');
    await userCollectionRef.doc(testUsername).set({username: testUsername});
    userTaskRef =  userCollectionRef.doc(testUsername).collection('tasks');
  });

  afterEach(async () => {
    await service.clearTaskList(testUsername);
    await userCollectionRef.doc(testUsername).delete();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and fetch new task', async () => {
    const task = taskModel;
    const success: boolean = await service.addTask(testUsername, task);
    expect(success).toBeTruthy();

    // expect(await service.getAllTasks(testUsername)).toContain(task);
  });

  /*
  it('should update tasks', async () => {
    let task: Task = taskModel;
    await userTaskRef.add(task).then(document => {
      task = document;
    });

    // update
    task.title = 'task was updated';
    const success: boolean = await service.updateTask(testUsername, task);
    expect(success).toBeTruthy();

    let data;
    await userTaskRef.doc(task.id).get().then(doc => data = doc.data());
    expect(data.title).toEqual(task.title);
  });*/

  it('should delete tasks', async () => {
    const task = taskModel;
    const tasksRef = firebase.firestore().collection('users').doc(testUsername).collection('tasks');
    await tasksRef.add(task).then(document => {
      task.id = document.id;
    });

    // delete
    await service.deleteTask(testUsername, task);
    await expect(await service.getAllTasks(testUsername)).not.toContain({id: task.id});
  });

});
