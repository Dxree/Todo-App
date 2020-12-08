import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {UserService} from '../user.service';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  message: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('[a-z0-9]*')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.message = {
      text: '',
      cssClass: ''
    };
  }

  onSubmit() {
    this.submitted = true;
    console.log('on submit called');
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.signUp(this.registerForm.controls.username.value.trim(), this.registerForm.controls.password.value)
      .then(
        () => {
          this.userService.signIn(this.registerForm.controls.username.value.trim(), this.registerForm.controls.password.value).then(
            () => this.router.navigate(['']), error => console.log(error)
          );
        },
        error => {
          switch (error.message) {
            case 'The email address is already in use by another account.':
              this.message.text = 'Benutzername bereits vergeben.';
              this.message.cssClass = 'alert alert-danger';
              break;
            default:
              console.log(error);
              this.message.text = 'Hoppla, da ist etwas schief gelaufen.';
              this.message.cssClass = 'alert alert-danger';
              break;
          }
          this.loading = false;
        });
  }
}
