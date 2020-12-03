import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Category} from './category.model';
import {error} from 'util';
import {Task} from './task.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFirestore) {
  }

  allCategories: Category [];

  /**
   * Promise of all categories created by a specific user
   */
  async getAllCategories(userName: string): Promise<Category[]> {
    const categories: Category[] = [];
    await this.db.firestore.collection('users').doc(userName).collection('categories').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
        categories.push(doc.data() as Category);
      });
    }).catch(
      e => console.log(e)
    );
    this.allCategories = categories;
    return categories;
  }

  /**
   * Promise will be <code>true</true> if adding task was successful
   */
  async addCategory(userName: string, category: Category): Promise<boolean> {
    let success = false;
    await this.db.firestore.collection('users').doc(userName).collection('categories')
      .doc(category.title).set(category, {merge: true})
      .then(() => success = true)
      .catch(e => {
        console.log(e);
        success = false;
      });
    this.getAllCategories(userName);
    return success;
  }

  /**
   *  rename existing category
   */
  async renameCategory(userName: string, originalCategoryId: string, updatedCategory: Category): Promise<boolean> {
    let success = true;
    const fireBaseCategoriesRef = this.db.firestore.collection('users').doc(userName).collection('categories');
    await fireBaseCategoriesRef
      .doc(originalCategoryId).delete()
      .then()
      .catch(() => success = false);
    await fireBaseCategoriesRef
      .doc(updatedCategory.title).set(updatedCategory)
      .then()
      .catch(() => success = false);
    await this.updateCategoryForAllTasks(userName, originalCategoryId, updatedCategory);
    return success;
  }

  /**
   * rename category "originalCategoryId" to "updatedCategory.title" for all tasks created by <userName>
   * if no updatedCategory is specified, originalCategory will be removed instead
   */
  async updateCategoryForAllTasks(userName: string, originalCategoryId: string, updatedCategory: Category = null) {
    const fireBaseTasksRef = this.db.firestore.collection('users').doc(userName).collection('tasks');
    await fireBaseTasksRef.get().then(querySnapshot => {
      querySnapshot.forEach(document => {
        const task: Task = document.data();
        if (task.categories.map(cat => cat.title).includes(originalCategoryId)) {
          const categories = task.categories.filter(cat => cat.title !== originalCategoryId);
          if (updatedCategory) {
            categories.push(updatedCategory);
          }
          fireBaseTasksRef.doc(document.id).set({
            categories
          }, {merge: true});
        }
      });
    });
  }

  /**
   * Promise will be <code>true</true> if deleting category was successful
   */
  async deleteCategory(userName: string, category: Category): Promise<boolean> {
    let success = false;
    await this.db.firestore.collection('users').doc(userName).collection('categories')
      .doc(category.title).delete()
      .then(() => success = true)
      .catch(e => {
        console.log(e);
        success = false;
      });
    this.updateCategoryForAllTasks(userName, category.title);
    this.getAllCategories(userName);
    return success;
  }

}
