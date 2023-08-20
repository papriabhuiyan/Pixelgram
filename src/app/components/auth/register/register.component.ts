import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Register } from "src/app/model/Register";
import { RegisterService } from "src/app/services/user/register/register.service";
import { UserService } from "src/app/services/user/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  submitted: any = false;
  found = false;
  constructor(public registerService: RegisterService, private route: Router, private userService: UserService) {}

  regForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  submit() {
    this.submitted = true;
    const userNameValue = this.regForm.controls.username.value;
    const passwordValue = this.regForm.controls.password.value;
    if (userNameValue && passwordValue) {
      const reg = new Register(userNameValue, passwordValue);
      this.registerService.registerUser(reg).subscribe({
        next: (val) => {
          val['username'] = userNameValue;
          localStorage.setItem(environment.userToken, JSON.stringify(val));
          console.log(this.userService.getTokenFromLocalStorage());
          this.route.navigate(["/"]);
        },
        error: (error) => {
          this.found = true;
        }
    });
    }
  }

  setFalse(){
    this.found = false;
  }

  ngOnInit(): void {
    // add code here
  }
}
