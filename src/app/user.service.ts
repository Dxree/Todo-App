import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from './user.model';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
  }

  /**
   * sign in user using username & password
   */
  async signIn(username: string, password: string): Promise<User> {
    const fakeEmail = username + '@kms-todo.de';
    let user: User = null;
    await this.auth.auth.signInWithEmailAndPassword(fakeEmail, password)
      .then(async firebaseUser => {
        user = await this.getUser(firebaseUser.user.email.split('@')[0]);
      });
    return user;
  }

  /**
   * create new user using username & password
   */
  async signUp(username: string, password: string): Promise<User> {
    const fakeEmail = username + '@kms-todo.de';
    let user: User;
    await this.auth.auth.createUserWithEmailAndPassword(fakeEmail, password)
      .then(() => {
        // create user entry in database
        this.db.firestore.collection('users').doc(username).set({
          username
        });
        // create user object to return
        user = {
          username,
          password
        };
      });
    return user;
  }

  /**
   * sign out current user
   */
  async signOut() {
    await this.auth.auth.signOut();
    console.log('sign out');
  }

  /**
   * get current user
   */
  async getCurrentUser(): Promise<User> {
    if (this.auth.auth.currentUser == null) {
      return null;
    }
    const currentUserMail = this.auth.auth.currentUser.email;
    const currentUser: User = await this.getUser(currentUserMail.split('@')[0]);
    return currentUser;
  }

  /**
   * get single user by password
   */
  async getUser(username: string): Promise<User> {
    let user: User = null;
    await this.db.firestore.collection('users').doc(username).get().then(querySnapshot => {
      user = querySnapshot.data();
    }).catch(
      error => console.log(error)
    );
    return user;
  }

  /**
   * all users, but without subcollections (tasks and categories)
   */
  async getUsers(): Promise<User[]> {
    const users: User[] = [];
    await this.db.firestore.collection('users').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
        users.push(doc.data() as User);
      });
    }).catch(
      error => console.log(error)
    );
    return users;
  }

  /**
   *  Promise will be <code>true</true> if adding user was successful
   * Pass existing username to update user values
   */
  async addOrUpdateUser(user: User): Promise<boolean> {
    let success = false;
    await this.db.firestore.collection('users')
      .doc(user.username).set(user, {merge: true})
      .then(() => success = true)
      .catch(error => {
        console.log(error);
        success = false;
      });
    return success;
  }

  async deleteUser(user: User): Promise<boolean> {
    await this.signIn(user.username, user.password).then();
    const currentUser = this.auth.auth.currentUser;
    if (currentUser == null) {
      return false;
    }
    let success = true;
    await this.db.firestore.collection('users').doc(user.username).delete().then(() => {}, () => success = false);
    await currentUser.delete().then(async () => {}, () => success = false);
    return success;
  }

}
