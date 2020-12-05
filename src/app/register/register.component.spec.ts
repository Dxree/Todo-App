import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from '../app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {Router, RouterModule} from '@angular/router';
import {routes} from '../app-routing.module';
import {GetListComponent} from '../get-list/get-list.component';
import {LoginComponent} from '../login/login.component';
import {AddTaskComponent} from '../add-task/add-task.component';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent, GetListComponent, LoginComponent, AddTaskComponent, AddCategoryComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbNavModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        RouterModule.forRoot(routes)
      ],
      providers: [
        AngularFirestore,
        RouterModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
