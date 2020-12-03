import {Task} from './task.model';
import {Category} from './category.model';

export interface User {
  username?: string; // must be unique
  password?: string;
  tasks?: Task[];
  categories?: Category[];
}
