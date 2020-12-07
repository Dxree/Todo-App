import {TestBed} from '@angular/core/testing';
import {CategoryService} from './category.service';
import {UserService} from './user.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {User} from './user.model';
import {Category} from './category.model';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let userService: UserService;
  let actualUser: User;
  const username = 'testuserbb123';
  const password = 'testuserbb123';
  const title = 'testkategoriebb1123';
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
    categoryService = TestBed.get(CategoryService);
    userService = TestBed.get(UserService);
    await categoryService.deleteCategory(username, {title}).catch(() => {
    });
    await categoryService.deleteCategory(username, {title: 'test32154321'}).catch(() => {});
    await userService.deleteUser({username, password}).catch(() => {
    });
  }, 10000);
  afterEach(async () => {
    await categoryService.deleteCategory(username, {title}).catch(() => {});
    await categoryService.deleteCategory(username, {title: 'test32154321'}).catch(() => {});
    await userService.deleteUser({username, password}).catch(() => {});
  }, 100000);
  it('should be created', () => {
    const service: CategoryService = TestBed.get(CategoryService);
    expect(service).toBeTruthy();
  });

  function signUp() {
    userService.signUp(username, password).then(user => {
      actualUser = user;
    });
  }

  it('getAllCategories für neuen User -> leere Liste', async () => {
    signUp();
    const categories: Category[] = await categoryService.getAllCategories(username);
    // noch keine Kategorien erstellt -> leere Liste
    expect(categories.length).toBe(0);
  }, 10000);
  it('addCategory für neuen User -> success = true, categories.length = 1, CategoryList, die zurück kommt beinhaltet ' +
    'neu erstelle Kategorie', async () => {
    signUp();
    const category: Category = {title};
    const added: boolean = await categoryService.addCategory(username, category);
    // noch keine Kategorien erstellt -> leere Liste
    expect(added).toBe(true);
    const categories: Category[] = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(1);
    expect(categories[0]).toEqual({title});
  }, 10000);
/*
  it('deleteCategory -> success = true, categories.length = 0, CategoryList, die zurück kommt beinhaltet ' +
    'keine Kategorien', async () => {
    signUp();
    let categories: Category[] = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(0);
    const category: Category = {title};
    await categoryService.addCategory(username, category);
    categories = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(1);
    const deleted: boolean = await categoryService.deleteCategory(username, category);
    expect(deleted).toBe(true);
  }, 10000);
 */
  /**
   * TODO: should be false ???
   */
  it('löschen einer nicht vorhandenen Kategorie -> success = false', async () => {
    signUp();
    const categories: Category[] = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(0);
    const category: Category = {title: 'test123456'};
    const deleted: boolean = await categoryService.deleteCategory(username, category);
    expect(deleted).toBe(false);
  }, 10000);
  it('rename category -> success = true', async () => {
    signUp();
    const category: Category = {title};
    const newCategory: Category = {title: 'test32154321'};
    let added: boolean;
    categoryService.addCategory(username, category).then(res => {
      added = res;
      expect(added).toBe(true);
      let categories: Category[];
      categoryService.getAllCategories(username).then(resp => {
        categories = resp;
        expect(categories.length).toBe(1);
        expect(categories[0]).toEqual({title});
        let renamed: boolean;
        categoryService.renameCategory(username, category.title, newCategory).then(respo => {
          renamed = respo;
          expect(renamed).toBe(true);
          categoryService.getAllCategories(username).then(response => {
            categories = response;
            expect(categories[0]).toEqual({title: 'test32154321'});
          });
        });
      });
    });
  }, 10000);
});
