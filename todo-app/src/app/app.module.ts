import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { GetListComponent } from './get-list/get-list.component';
import { TaskComponent } from './task/task.component';
import {FormsModule} from '@angular/forms';
import { AddTaskComponent } from './add-task/add-task.component';

const firebaseConfig = {
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
    TaskComponent,
    AddTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
