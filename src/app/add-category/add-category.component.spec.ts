import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCategoryComponent} from './add-category.component';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {GetListComponent} from '../get-list/get-list.component';
import {firebaseConfig} from '../app.module';
import {User} from '../user.model';
import {UserService} from '../user.service';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;

  let componentUserService: UserService;
  let userService: UserService;
  let userServiceStub: Partial<UserService>;

  beforeEach(async(() => {

    userServiceStub = {
      async getCurrentUser() {
        const u: User = {username: 'testname', password: 'testpassword'};
        return u;
      }
    };

    TestBed.configureTestingModule({
      declarations: [AddCategoryComponent],
      imports: [
        FormsModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule
      ],
      providers: [
        AngularFirestore,
        GetListComponent,
        {
          provide: UserService, useValue: userServiceStub
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    fixture.detectChanges();
  }));



  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
