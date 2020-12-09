import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserService} from '../user.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from '../app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {User} from '../user.model';
import {CategoryService} from '../category.service';
import {GetListComponent} from '../get-list/get-list.component';


import {AddCategoryComponent} from './add-category.component';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let addCategory: AddCategoryComponent;
  let userService: UserService;
  let categoryService: CategoryService;
  let getListComp;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    categoryService = TestBed.get(CategoryService);
    userService = TestBed.get(UserService);
    getListComp = TestBed.createComponent(GetListComponent);
    addCategory = new AddCategoryComponent(categoryService, getListComp, userService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('', () => {
    console.log(addCategory.newCategory);
  });
});
