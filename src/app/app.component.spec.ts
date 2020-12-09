import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {UserService} from './user.service';
import {User} from './user.model';

describe('AppComponent', () => {
  let componentUserService: UserService;
  let userService: UserService;
  let userServiceStub: Partial<UserService>;

  let fixture: ComponentFixture<AppComponent>;

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

    fixture = TestBed.createComponent(AppComponent);
    userService = fixture.debugElement.injector.get(UserService);
    componentUserService = userService;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Todo-List'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Todo-List');
  });



});
