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
import {Location} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
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
        RouterModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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

  it('on click of button "registerSubmitBtn" onSubmit() should be called', fakeAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      spyOn(component, 'onSubmit');
      const button = compiled.querySelector('#loginSubmitBtn');
      button.click();
      tick();
      fixture.detectChanges();
      expect(component.onSubmit).toHaveBeenCalled();
    })
  );

  it('on click on router link "Registrieren" you should be on register page', fakeAsync((
    inject([Router, Location], (router: Router, location: Location) => {
        const compiled = fixture.debugElement.nativeElement;
        const routerLink = compiled.querySelector('#register-link');
        routerLink.click();
        tick();
        expect(router.url).toBe('/register');
      }
    )
  )));
});
