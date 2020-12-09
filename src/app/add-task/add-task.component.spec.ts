import { ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AddTaskComponent} from './add-task.component';
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


describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

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
      declarations: [AddTaskComponent, GetListComponent],
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

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    userService = TestBed.inject(UserService);
    categoryService = fixture.debugElement.injector.get(CategoryService);
    componentCategoryService = categoryService;
    categoryService = TestBed.inject(CategoryService);
    taskService = fixture.debugElement.injector.get(TaskService);
    componentTaskService = taskService;
    taskService = TestBed.inject(TaskService);

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

  it('on click of button "add-task-cancel-btn" cancel() should be called, app-add-task should not be visible', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'cancel');
      const button = compiled.querySelector('#add-task-cancel-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.cancel).toHaveBeenCalled();
      expect(compiled.querySelector('#app-add-task')).toBeFalsy();
    })
  );


  xit('on valid input, #addTask should be called, app-add-task should not be visible anymore', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(taskService, 'addTask');
      fixture.whenStable().then(fakeAsync(() => {
        const el1 = fixture.debugElement.query(By.css('#addTitle')).nativeElement;
        el1.value = 'testtitle';
        el1.dispatchEvent(new Event('input'));
        const button = compiled.querySelector('#add-task-confirm-btn');
        button.click();
        tick();
        fixture.detectChanges();
        expect(taskService.addTask).toHaveBeenCalled();
        expect(compiled.querySelector('#app-add-task')).toBeFalsy();
      }));

    })
  );

  xit('on invalid input, #addTask should be not be called and there should be an error message', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(taskService, 'addTask');
      spyOn(window, 'alert');
      fixture.whenStable().then(fakeAsync(() => {
        const el1 = fixture.debugElement.query(By.css('#addTitle')).nativeElement;
        el1.value = '';
        el1.dispatchEvent(new Event('input'));
      }));
      const button = compiled.querySelector('#add-task-confirm-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(taskService.addTask).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Die Aufgabe muss einen Titel haben.');
    })
  );

  it('on cancel, new task should be reset', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.whenStable().then(() => {
        const el1 = fixture.debugElement.query(By.css('#addTitle')).nativeElement;
        el1.value = 'titleToBeReset';
        el1.dispatchEvent(new Event('input'));
      });
      AddTaskComponent.prototype.cancel = async () => {
          AddTaskComponent.prototype.resetTask();
    } ;
      const button = compiled.querySelector('#add-task-cancel-btn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.newTask.title === '').toBeTruthy();
    })
  );
});
