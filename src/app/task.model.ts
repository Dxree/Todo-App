import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import {Category} from './category.model';

export interface Task {
  id?: string;  // might be changed to string later due to firebase id format
  title?: string;
  description?: string;
  done?: boolean;
  priority?: number;
  categories?: Category[];
  created?: FieldValue;
  deadline?: Timestamp;
}
