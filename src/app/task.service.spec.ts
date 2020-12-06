import {TestBed} from '@angular/core/testing';
import {firebaseConfig} from './app.module';

import {TaskService} from './task.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';

describe('TaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireAuthModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule
    ],
    providers: [
      AngularFirestore
    ]
  }));

  it('should be created', () => {
    const service: TaskService = TestBed.get(TaskService);
    expect(service).toBeTruthy();
  });
});
