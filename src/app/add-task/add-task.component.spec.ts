import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {AddTaskComponent} from './add-task.component';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {GetListComponent} from '../get-list/get-list.component';
import {firebaseConfig} from '../app.module';
import {UserService} from '../user.service';
import {CategoryService} from '../category.service';
import { of, defer } from 'rxjs';
import {Router} from "@angular/router";
import {Location} from "@angular/common";

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}


describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let getCurrentUserSpy: jasmine.Spy;
  let getAllCategoriesSpy: jasmine.Spy;

  beforeEach(() => {
    const username = 'TestUser';
    const allCategories = [
      {
        title: 'Testkat1'
      },
      {
        title: 'Testkat2'
      }
    ];

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    getCurrentUserSpy =  userServiceSpy.getCurrentUser.and.returnValue(of(username));

    const categoryServiceSpy = jasmine.createSpyObj('categoryService', ['getAllCategories']);
    getAllCategoriesSpy =  categoryServiceSpy.getAllCategories.and.returnValue(of(allCategories));



    AddTaskComponent.prototype.ngOnInit = async () => {
      getCurrentUserSpy.and.returnValue(asyncData(username));
      getAllCategoriesSpy.and.returnValue(asyncData(allCategories));
    } ;

    TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
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
          provide: UserService, useValue: userServiceSpy
        },
        {
          provide: CategoryService, useValue: categoryServiceSpy
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Neue Aufgabe erstellen');
  });

  it('should render all necessary input fields ', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#addTitle')).toBeTruthy();
    expect(compiled.querySelector('#add-description')).toBeTruthy();
    expect(compiled.querySelector('#add-priority')).toBeTruthy();
    expect(compiled.querySelector('#add-category')).toBeTruthy();
    expect(compiled.querySelector('#deadline')).toBeTruthy();
  });

  it('should render cancel and confirm buttons ', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#add-task-cancel-btn')).toBeTruthy();
    expect(compiled.querySelector('#add-task-confirm-btn')).toBeTruthy();
  });

  it('should render all 5 labels for input fields  ', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('label').length === 5).toBeTruthy();
  });

  it('on click of button "add-task-confirm-btn" confirm() should be called', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'confirm');
      const button = compiled.querySelector('#add-task-confirm-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.confirm).toHaveBeenCalled();
    })
  );

  it('on click of button "add-task-cancel-btn" cancel() should be called', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'cancel');
      const button = compiled.querySelector('#add-task-cancel-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.confirm).toHaveBeenCalled();
    })
  );

  // TODO: check for css classes

});
