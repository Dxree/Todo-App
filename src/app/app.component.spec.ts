import {TestBed, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {UserService} from "./user.service";
import {User} from "./user.model";

describe('AppComponent', () => {
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
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
    {
      provide: UserService, useValue: userServiceStub
    },
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Todo-List'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Todo-List');
  });



});
