import {TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireAuthModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule
    ],
    providers: [
      AngularFirestore,
    ]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
