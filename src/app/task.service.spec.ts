import {TestBed} from '@angular/core/testing';
import {firebaseConfig} from './app.module';

import {TaskService} from './task.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import * as firebase from 'firebase';

describe('TaskService', () => {

  const testUsername = 'user-for-taskService-test';
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
