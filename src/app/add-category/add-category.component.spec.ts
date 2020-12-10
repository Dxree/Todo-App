import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AddCategoryComponent} from './add-category.component';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {GetListComponent} from '../get-list/get-list.component';
import {firebaseConfig} from '../app.module';
import {UserService} from '../user.service';
import {CategoryService} from '../category.service';
import {User} from '../user.model';
import {Category} from '../category.model';
import {TaskService} from '../task.service';
import {Task} from '../task.model';
import {By} from '@angular/platform-browser';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let componentUserService: UserService;
  let userService: UserService;
  let userServiceStub: Partial<UserService>;
  let componentCategoryService: CategoryService;
  let categoryService: CategoryService;
  let categoryServiceStub: Partial<CategoryService>;
  let componentTaskService: TaskService;
  let taskService: TaskService;
  let taskServiceStub: Partial<TaskService>;
  beforeEach(() => {
    userServiceStub = {
      async getCurrentUser() {
        const u: User = {username: 'testname', password: 'testpassword'};
        return u;
      }
    };
    categoryServiceStub = {
      async getAllCategories(username: string) {
        const allCategories: Category[] = [{title: 'kat1'}, {title: 'kat2'}];
        return allCategories;
      }
    };
    taskServiceStub = {
      async addTask(username: string, task: Task) {
        return true;
      },
      async getAllTasks(username: string) {
        const allTasks: Task[] = [{title: 'task 1', priority: 3}, {title: 'task 2', priority: 3}];
        return allTasks;
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
        {
          provide: CategoryService, useValue: categoryServiceStub
        },
        {
          provide: TaskService, useValue: taskServiceStub
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    // userService = TestBed.inject(UserService);
    categoryService = fixture.debugElement.injector.get(CategoryService);
    componentCategoryService = categoryService;
    // categoryService = TestBed.inject(CategoryService);
    taskService = fixture.debugElement.injector.get(TaskService);
    componentTaskService = taskService;
    // taskService = TestBed.inject(TaskService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Neue Kategorie erstellen');
  });
  it('should render necessary input field an label', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#addTitleCategory')).toBeTruthy();
    expect(compiled.querySelectorAll('label').length === 1).toBeTruthy();
  });
  it('should render cancel and confirm buttons', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#add-category-cancel-btn')).toBeTruthy();
    expect(compiled.querySelector('#add-category-confirm-btn')).toBeTruthy();
  });
  xit('on valid input, #addCategory should be called, app-add-category should not be visible anymore', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(categoryService, 'addCategory');
    fixture.whenStable().then(() => {
      const val1 = fixture.debugElement.query(By.css('#addTitleCategory')).nativeElement;
      val1.value = 'testKategorie';
      val1.dispatchEvent(new Event('input'));
      const button = compiled.querySelector('#add-category-confirm-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.confirm).toHaveBeenCalled();
      expect(compiled.querySelector('#app-add-category')).toBeFalsy();
    });
  }));
  it('on click of button "add-category-cancel-btn" cancel() should be called, app-add-task should not be visible', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'cancel');
      const button = compiled.querySelector('#add-category-cancel-btn');
      button.click();
      tick(1222);
      fixture.detectChanges();
      expect(component.cancel).toHaveBeenCalled();
      expect(compiled.querySelector('#app-add-category')).toBeFalsy();
    }));
});
