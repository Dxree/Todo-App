export interface Task {
  id?: string;  // might be changed to string later due to firebase id format
  title?: string;
  description?: string;
  done?: boolean;
  priority?: number;
  categories?: string[];
}
