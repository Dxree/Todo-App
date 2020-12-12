import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';


import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {GetListComponent} from './get-list/get-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddTaskComponent} from './add-task/add-task.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {AddCategoryComponent} from './add-category/add-category.component';
import {CommonModule} from '@angular/common';

export const firebaseConfig = {
  apiKey: 'AIzaSyDtE_VpAXduml53_SPDVMk-Oghe_X-kPAE',
  authDomain: 'kms-todolist.firebaseapp.com',
  databaseURL: 'https://kms-todolist.firebaseio.com',
  projectId: 'kms-todolist',
  storageBucket: 'kms-todolist.appspot.com',
  messagingSenderId: '661455319693',
  appId: '1:661455319693:web:54a909fe4a11fd7ba3a8c4'
};

@NgModule({
  declarations: [
    AppComponent,
    GetListComponent,
    AppComponent,
    AddTaskComponent,
    LoginComponent,
    RegisterComponent,
    AddCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    CommonModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    AddTaskComponent,
    AddCategoryComponent
  ],
})
export class AppModule {
}
