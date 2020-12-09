import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

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
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {By} from '@angular/platform-browser';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let componentUserService: UserService;
  let userService: UserService;
  let userServiceStub: Partial<UserService>;

  beforeEach(async(() => {

    userServiceStub = {
      async signUp(username: string, password: string) {
        console.log('signup-test');
        const u: User = {username, password};
        return u;
      },
      async signIn(username: string, password: string) {
        console.log('signin-test');
        const u: User = {username, password};
        return u;
      }
    };

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
    fixture = TestBed.createComponent(RegisterComponent);
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
    expect(compiled.querySelector('h2').textContent).toContain('Registrierung');
  });

  it('should render input field for username and for password', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#username')).toBeTruthy();
    expect(compiled.querySelector('#password')).toBeTruthy();
  });

  it('on click of button "registerSubmitBtn" onSubmit() should be called', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(component, 'onSubmit');
    const button = compiled.querySelector('#registerSubmitBtn');
    button.click();
    tick();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  })
  );

  xit('on click of button "registerSubmitBtn" #onSubmit should be executed if input is valid and #signUp in userService should be called',
    fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.whenStable().then(() => {
        const el1 = fixture.debugElement.query(By.css('#username')).nativeElement;
        expect(el1.value).toBe('');
        el1.value = 'testuser';
        el1.dispatchEvent(new Event('input'));

        const el2 = fixture.debugElement.query(By.css('#password')).nativeElement;
        expect(el2.value).toBe('');
        el2.value = 'testpassword';
        el2.dispatchEvent(new Event('input'));

        spyOn(userService, 'signUp');
        const button = compiled.querySelector('#registerSubmitBtn');
        button.click();
        tick();
        fixture.detectChanges();
        expect(userService.signUp).toHaveBeenCalled();
      });
    })
  );

  xit('on invalid input #signUp in userService should not be called and an error message should appear',
    fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.whenStable().then(() => {
        const el1 = fixture.debugElement.query(By.css('#username')).nativeElement;
        expect(el1.value).toBe('');
        el1.value = 'testUserINvalid';
        el1.dispatchEvent(new Event('input'));

        const el2 = fixture.debugElement.query(By.css('#password')).nativeElement;
        expect(el2.value).toBe('');
        el2.value = 'testpassword';
        el2.dispatchEvent(new Event('input'));

        spyOn(userService, 'signUp');
        const button = compiled.querySelector('#registerSubmitBtn');
        button.click();
        tick();
        fixture.detectChanges();
        expect(userService.signUp).not.toHaveBeenCalled();
        expect(compiled.querySelector('.invalid-feedback')).toBeTruthy();
      });
    })
  );

  it('on click on router link "Abbrechen" you should be back on login page', fakeAsync((
    inject([Router], (router: Router) => {
    const compiled = fixture.debugElement.nativeElement;
    const routerLink = compiled.querySelector('#login-link');
    routerLink.click();
    tick();
    expect(router.url).toBe('/login');
    }
  )
  )));

});
