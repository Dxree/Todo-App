import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from '../app.module';
import {Router, RouterModule} from '@angular/router';
import {routes} from '../app-routing.module';
import {GetListComponent} from '../get-list/get-list.component';
import {RegisterComponent} from '../register/register.component';
import {AddTaskComponent} from '../add-task/add-task.component';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {UserService} from '../user.service';
import {User} from '../user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let componentUserService: UserService;
  let userService: UserService;
  let userServiceStub: Partial<UserService>;

  beforeEach(async(() => {

    userServiceStub = {
      async signIn(username: string, password: string): Promise<User> {
        const u: User = {username, password};
        return new Promise<User>((resolve => {
          resolve(u);
        }));
      },
      async getCurrentUser() {
        const u: User = {username: 'testname', password: 'testpassword'};
        return u;
      }
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent, GetListComponent, RegisterComponent, AddTaskComponent, AddCategoryComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbNavModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        [RouterTestingModule.withRoutes(routes)]
      ],
      providers: [
        AngularFirestore,
        RouterModule,
        { provide: UserService, useValue: userServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Anmeldung');
  });

  it('should render input field for username and for password', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#username')).toBeTruthy();
    expect(compiled.querySelector('#password')).toBeTruthy();
  });

  it('on click of button "loginSubmitBtn" #onSubmit should be called', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'onSubmit');
      const button = compiled.querySelector('#loginSubmitBtn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.onSubmit).toHaveBeenCalled();
    })
  );

  it('on valid input #signIn in userService should be called',
    fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      const u: User = {username: 'test', password: 'password'};
      spyOn(userService, 'signIn').and.returnValue(Promise.resolve(u));
      component.loginForm.controls.username.setValue('test1');
      component.loginForm.controls.password.setValue('123456');
      expect(component.loginForm.controls.username.value).toEqual('test1');
      inject([Router], (router: Router) => {
        component.onSubmit();
        tick();
        fixture.detectChanges();
        expect(userService.signIn).toHaveBeenCalled();
        }
      );
     })
  );

  it('on invalid input #signIn in userService should not be called and an error message should appear',
    fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.whenStable().then(() => {
        const el1 = fixture.debugElement.query(By.css('#username')).nativeElement;
        expect(el1.value).toBe('');
        el1.value = '';
        el1.dispatchEvent(new Event('input'));

        const el2 = fixture.debugElement.query(By.css('#password')).nativeElement;
        expect(el2.value).toBe('');
        el2.value = '';
        el2.dispatchEvent(new Event('input'));

        spyOn(userService, 'signIn');
        const button = compiled.querySelector('#loginSubmitBtn');
        button.click();
        tick();
        fixture.detectChanges();
        expect(userService.signIn).not.toHaveBeenCalled();
        expect(compiled.querySelector('.invalid-feedback')).toBeTruthy();
      });
    })
  );

  it('on click on router link "Registrieren" you should be on register page', fakeAsync((
    inject([Router], (router: Router) => {
        const compiled = fixture.debugElement.nativeElement;
        const routerLink = compiled.querySelector('#register-link');
        routerLink.click();
        tick();
        expect(router.url).toBe('/register');
      }
    )
  )));
});
