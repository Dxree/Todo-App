import {TestBed} from '@angular/core/testing';

import {CategoryService} from './category.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './app.module';

describe('CategoryService', () => {
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
    const service: CategoryService = TestBed.get(CategoryService);
    expect(service).toBeTruthy();
  });
});
