import {TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {User} from './user.model';

describe('UserService', () => {
  let service: UserService;
  const username = 'username1';
  const password = 'password';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule
      ],
      providers: [
        AngularFirestore,
      ]
    });
    service = TestBed.inject(UserService);
    await service.deleteUser({username, password}).catch(() => {
    });
  }, 10000);

  afterEach(async () => {
    await service.deleteUser({username, password}).catch(() => {
    });
  }, 100000);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign up and get new user', async () => {
    /* user doesn't exist already */
    expect(await service.getUsers()).not.toContain({username});
    /* user exists now */
    let actualUser: User = null;
    await service.signUp(username, password).then(user => {
      actualUser = user;
    });
    expect(await service.getUsers()).toContain({username});
    /* actual user was expected */
    const expectedUser: User = {username, password};
    await expect(actualUser).toEqual(expectedUser);
  }, 10000);

  it('should sign in and get existing user', async () => {
      /* user doesn't exist already */
      expect(await service.getUsers()).not.toContain({username});
      /* user exists now */
      await service.signUp(username, password);
      expect(await service.getUsers()).toContain({username});
      /* sign in existing user */
      let actualUser: User = null;
      await service.signIn(username, password).then(user => {
        actualUser = user;
      });
      const expectedUser: User = {username};
      expect(expectedUser).toEqual(actualUser);
      expect(expectedUser).toEqual(await service.getCurrentUser());
    }, 10000
  );

  it('should not sign up new user with already existing username', async () => {
    /* user doesn't exist already */
    let allUsers: User[] = await service.getUsers();
    expect(allUsers).not.toContain({username});
    /* user exists now */
    await service.signUp(username, password);
    allUsers = await service.getUsers();
    expect(allUsers).toContain({username});
    /* username already taken */
    await expectAsync(service.signUp(username, password)).toBeRejected();
  }, 10000);

  it('should delete existing user', async () => {
    /* user doesn't exist already */
    let allUsers: User[] = await service.getUsers();
    expect(allUsers).not.toContain({username});
    /* user exists now */
    await service.signUp(username, password);
    allUsers = await service.getUsers();
    expect(allUsers).toContain({username});
    /* user doesn't exist anymore */
    await service.deleteUser({username, password});
    allUsers = await service.getUsers();
    expect(allUsers).not.toContain({username});
  }, 10000);

  it('should not delete not existing user', async () => {
    /* user doesn't exist  */
    const allUsers = await service.getUsers();
    await expect(allUsers).not.toContain({username});
    /* user can't be deleted  */
    await expectAsync(service.deleteUser({username, password})).toBeRejected();
  }, 10000);

  it('should sign out existing user', async () => {
    /* user doesn't exist  */
    let allUsers: User[] = await service.getUsers();
    await expect(allUsers).not.toContain({username});
    /* user exists now */
    await service.signUp(username, password);
    allUsers = await service.getUsers();
    expect(allUsers).toContain({username});
    /* sign in user */
    await service.signIn(username, password);
    expect(await service.getCurrentUser()).toEqual({username});
    /* sign out user */
    await expectAsync(service.signOut()).toBeResolved();
    expect(await service.getCurrentUser()).toBe(null);
  }, 10000);

  it('should not sign in existing or new user with wrong username or password', async () => {
    /* user doesn't exist  */
    let allUsers: User[] = await service.getUsers();
    await expect(allUsers).not.toContain({username});
    /* not existing user can't sign in  */
    await expectAsync(service.signIn(username, password)).toBeRejected();
    /* user exists now */
    await service.signUp(username, password);
    allUsers = await service.getUsers();
    expect(allUsers).toContain({username});
    /* user can't sign in with wrong password */
    await expectAsync(service.signIn(username, password + '123')).toBeRejected();
  }, 10000);

});
