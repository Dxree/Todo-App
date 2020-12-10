import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';


@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.message = {
      text: '',
      cssClass: ''
    };
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.signIn(this.loginForm.controls.username.value.trim(), this.loginForm.controls.password.value)
      .then(
        () =>
          this.router.navigate(['']),
        error => {
          switch (error.message) {
            case 'The password is invalid or the user does not have a password.':
              this.message.text = 'Benutzername oder Passwort ungültig.';
              this.message.cssClass = 'alert alert-danger';
              break;
            case 'There is no user record corresponding to this identifier. The user may have been deleted.':
              this.message.text = 'Benutzername oder Passwort ungültig.';
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
