import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Task} from './task.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore) {
  }

  /**
   * Promise of all tasks created by a specific user
   */
  async getAllTasks(userName: string): Promise<Task[]> {
    const tasks: Task[] = [];
    await this.db.firestore.collection('users').doc(userName).collection('tasks')
      .orderBy('created', 'desc').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log(doc.id, ' => ', doc.data());
          const task: Task = doc.data() as Task;
          task.id = doc.id;
          tasks.push(task);
        });
      }).catch(
        error => console.log(error)
      );
    return tasks;
  }

  /**
   * Promise will be <code>true</code> if adding task was successful
   */
  async addTask(userName: string, task: Task): Promise<boolean> {
    let success = false;
    task.created = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.firestore.collection('users').doc(userName).collection('tasks')
      .add(task)
      .then(() => success = true)
      .catch(error => {
        console.log(error);
        success = false;
      });
    return success;
  }


  /**
   * Promise will be <code>true</code> if updating task was successful
   */
  async updateTask(userName: string, task: Task): Promise<boolean> {
    let success = false;
    await this.db.firestore.collection('users').doc(userName).collection('tasks')
      .doc(task.id).set(task, {merge: true})
      .then(() => success = true)
      .catch(error => {
        console.log(error);
        success = false;
      });
    return success;
  }

  /**
   * Promise will be <code>true</true> if deleting task was successful
   */
  async deleteTask(userName: string, task: Task): Promise<boolean> {
    let success = false;
    await this.db.firestore.collection('users').doc(userName).collection('tasks')
      .doc(task.id).delete()
      .then(() => success = true)
      .catch(error => {
        console.log(error);
        success = false;
      });
    return success;
  }

  async clearTaskList(userName: string): Promise<void> {
    const collectionRef = this.db.firestore.collection('users').doc(userName).collection('tasks');
    await collectionRef
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(document => {
          collectionRef.doc(document.id).delete();
        });
      });
  }

}
