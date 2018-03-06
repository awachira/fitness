import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  maxDate: Date;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.signupForm = this.fb.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      birthdate: new FormControl(this.maxDate, {
        validators: [Validators.required]
      }),
      agree: new FormControl(false, {
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get birthdate() { return this.signupForm.get('birthdate'); }
  get agree() { return this.signupForm.get('agree'); }
}
