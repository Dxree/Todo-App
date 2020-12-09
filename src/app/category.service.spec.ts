import {TestBed} from '@angular/core/testing';
import {CategoryService} from './category.service';
import {UserService} from './user.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './app.module';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {User} from './user.model';
import {Category} from './category.model';
import {getLocaleTimeFormat} from '@angular/common';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let userService: UserService;
  // let actualUser: User;
  const d = new Date();
  const n = d.getTime();
  const username = 'newuser' + n.toString();
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
    await deleteAllCategories();
    // await signUp();
  }, 10000);
  afterEach(async () => {
    // await userService.deleteUser({username, password}).catch(() => {});
    await deleteAllCategories();
    console.log('test passed');
    console.log(await categoryService.getAllCategories(username));
  }, 100000);
  it('should be created', async () => {
    expect(categoryService).toBeTruthy();
  });

  it('getAllCategories für neuen User -> leere Liste', async () => {
    const categories: Category[] = await categoryService.getAllCategories(username);
    // noch keine Kategorien erstellt -> leere Liste
    expect(categories.length).toBe(0);
  }, 10000);
  it('addCategory für neuen User -> success = true, categories.length = 1, CategoryList, die zurück kommt beinhaltet ' +
    'neu erstelle Kategorie', async () => {
    const category: Category = {title};
    const added: boolean = await categoryService.addCategory(username, category);
    // noch keine Kategorien erstellt -> leere Liste
    expect(added).toBe(true);
    const categories: Category[] = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(1);
  }, 10000);
  it('deleteCategory -> success = true, categories.length = 0, CategoryList, die zurück kommt beinhaltet ' +
    'keine Kategorien', async () => {
    let categories: Category[] = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(0);
    const category: Category = {title};
    await categoryService.addCategory(username, category);
    categories = await categoryService.getAllCategories(username);
    expect(categories.length).toBe(1);
    const deleted: boolean = await categoryService.deleteCategory(username, category);
    expect(deleted).toBe(true);
  }, 10000);
  it('rename category -> success = true', async () => {
      const category: Category = {title};
      const newCategory: Category = {title: 'test32154321'};
      const added: boolean = await categoryService.addCategory(username, category);
      expect(added).toBe(true);
      let categories: Category[] = await categoryService.getAllCategories(username);
      expect(categories.length).toBe(1);
      expect(categories[0]).toEqual({title});
      const renamed: boolean = await categoryService.renameCategory(username, category.title, newCategory);
      expect(renamed).toBe(true);
      categories = await categoryService.getAllCategories(username);
      expect(categories[0]).toEqual({title: 'test32154321'});
    },
    10000);

  async function deleteAllCategories() {
    const categories: Category [] = await categoryService.getAllCategories(username);
    for (const cat of categories) {
      await categoryService.deleteCategory(username, cat).catch(() => {
      });
    }
  }
});
