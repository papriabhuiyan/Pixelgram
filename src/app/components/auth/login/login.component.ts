import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submited: boolean = false;
  invalid: boolean = false;
  emptyUserName: boolean = false;
  emptyPassword: boolean = false;
  isAuth: boolean = false;

  signinForm = new FormGroup ({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private formBuilder: FormBuilder, public userService:UserService, private router:Router) { }

  ngOnInit(): void {
    
  }

  login() {
    this.submited = true;
    const userNameValue = this.signinForm.controls.userName.value;
    const passwordValue = this.signinForm.controls.password.value;
    if (userNameValue && passwordValue){
         this.userService.login(userNameValue, passwordValue).subscribe({
      next: (val : any) => {
        val['username'] = userNameValue;
        localStorage.setItem(environment.userToken, JSON.stringify(val));
        console.log(this.userService.getTokenFromLocalStorage())
        this.router.navigate(["/"]);
      },
      error: (res) => {
        this.invalid = true;
      }
    });
    }
   
  }

  setFalse(){
    console.log("can you reach me?");
    this.invalid = false;
  }
}
  