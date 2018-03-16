import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIEventsService } from '../../services/uievents.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  maxDate: Date;
  isLoading = false;
  private loadingSub: Subscription;

  constructor(private fb: FormBuilder,
  private authService: AuthService,
  private uiService: UIEventsService) { }

  ngOnInit() {
    this.loadingSub = this.uiService
        .loadingStateChanged
        .subscribe(isLoading => this.isLoading = isLoading);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.signupForm = this.fb.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      birthdate: new FormControl('', {
        validators: [Validators.required]
      }),
      agree: new FormControl(false, {
        validators: [Validators.required]
      })
    });
  }

  ngOnDestroy() {
    if (this.loadingSub) { this.loadingSub.unsubscribe(); }
  }

  onSubmit() {
    console.log(this.signupForm);
    this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get birthdate() { return this.signupForm.get('birthdate'); }
  get agree() { return this.signupForm.get('agree'); }
}
