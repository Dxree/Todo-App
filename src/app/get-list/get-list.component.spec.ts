import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GetListComponent} from './get-list.component';
import {DebugElement} from "@angular/core";
import {Task} from "../task.model";
import {Category} from "../category.model";

// Variables for Testing
let component: GetListComponent;
let fixture: ComponentFixture<GetListComponent>;
let de: DebugElement;
let debugCategory: Category = {
  title: 'testCategory'
};
let debugCategory2: Category = {
  title: 'testCategory2'
};
let debugTask: Task = {
  id: '1',
  title: 'testTask',
  description: 'this is a test task',
  priority: 3,
  done: false,
  categories: [debugCategory]
};
let debugTask2: Task = {
  id: '2',
  title: 'testTask2',
  description: 'this is a second test task',
  priority: 1,
  done: false,
  categories: [debugCategory2]
};
let debugTaskArr: Task[] = [debugTask, debugTask2]
let debugFilter: string = 'testCategory';

describe('GetListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('get-list functions should work as intended', testingFunctions)
});

function testingFunctions(){
  it('should call ngOnInit', function () {
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  it('should return the ToDoList and DoneList', () => {
    // Add Test
  })
  it('should return the correct Priority of an Icon', () => {
    let priority: number[] = [1,2,3,4,5];
    expect(component.getIconClassForPriority(priority[0])).toBe('\'fa-angle-double-down fa-2x\'')
    expect(component.getIconClassForPriority(priority[1])).toBe('\'fa-angle-down fa-2x\'')
    expect(component.getIconClassForPriority(priority[2])).toBe('\'fa-bars fa-lg\'')
    expect(component.getIconClassForPriority(priority[3])).toBe('\'fa-angle-up fa-2x\'')
    expect(component.getIconClassForPriority(priority[4])).toBe('\'fa-angle-double-up fa-2x\'')
  })
  it('should set Task to editable', () => {
    component.editTask(debugTask);
    expect(component.editableTask).toBe(debugTask);
  })
  it('should set CategoryID and editable Category', function () {
    component.editCategory(debugCategory);
    expect(component.originalCategoryId).toBe(debugCategory.title);
    expect(component.editableCategory).toBe(debugCategory);
  });
  it('should confirm Edit', () => {
    // Add Test for Confirm Edit
  })
  it('should confirm Category Edit', () => {
    // Add Test for Confirm Edit Category
  })
  it('should delete Task', () => {
    // Add Test for delete Task
  })
  it('should delete Category', () => {
    // Add Test for delete Category
  })
  it('should filter', function () {
    // Add Test for Filter
  });
  it('should filter Category correctly', function () {
    const filterReturn = component.filterCategory(debugTaskArr, debugFilter)
    expect(filterReturn).toBe(debugTaskArr)
    // Something went wrong here, this Test should not be true
  });
  it('should reset the Filter for Category', function () {
    // Add Test for Reset Filter Category
  });
  it('should return the Category List', function () {
    // Add a Test for Get Category List
  });
  it('should return the korrekt String priority', function () {
    let priority: number[] = [1,2,3,4,5];
    expect(component.getStringForPriority(priority[0])).toBe('sehr niedrig');
    expect(component.getStringForPriority(priority[2])).toBe('niedrig');
    expect(component.getStringForPriority(priority[3])).toBe('mittel');
    expect(component.getStringForPriority(priority[4])).toBe('hoch');
    expect(component.getStringForPriority(priority[5])).toBe('sehr hoch');
    expect(component.getStringForPriority(null)).toBe('not a priority');
  });
}
