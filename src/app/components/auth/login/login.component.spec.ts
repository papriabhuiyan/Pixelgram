import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'getTokenFromLocalStorage']);
    
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule, FormsModule ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login() should call user service login with correct values', () => {
    userServiceSpy.login.and.returnValue(of({
        access_token: "string",
        expires_in: 0,
        refresh_expires_in: 0,
        refresh_token: "string",
        token_type: "string",
        session_state: "string",
        scope: "string",
        notBeforePolicy: 0,
    })); 
    spyOn(component, 'login').and.callThrough()
     component.submited = true;
     fixture.detectChanges();

    let passwordTextBox = fixture.nativeElement.querySelector('[data-test-id="password"]');
    let userNameTextBox = fixture.nativeElement.querySelector('[data-test-id="username"]');
    let signinForm = fixture.nativeElement.querySelector('[data-test-id="signinForm"]');

    passwordTextBox.value = "password";
    passwordTextBox.dispatchEvent(new Event('input'));

    userNameTextBox.value = "user";
    userNameTextBox.dispatchEvent(new Event('input'));

    signinForm.dispatchEvent(new Event('submit'));

    component.login();
    
    fixture.whenRenderingDone();
    fixture.whenStable().then(() => {
      expect(userServiceSpy.login).toHaveBeenCalledWith("user", "password");
    });
  })

  it('login should set invalid to true if userService returns error', () => {
    userServiceSpy.login.and.returnValue(throwError(() => new Error()))
    spyOn(component, 'login').and.callThrough()

    component.submited = true;
    component.invalid = false;
    fixture.detectChanges();

    const dummyUser = {
      userName: "user",
      password: "password",
    };
    component.signinForm.patchValue(dummyUser)
    fixture.detectChanges();

    component.login()
    fixture.detectChanges()

    expect(component.invalid).toBeTrue()
  })

  it('setFalse should make invalid false', () => {
    component.invalid = true

    component.setFalse();
    fixture.detectChanges()
    
    expect(component.invalid).toBeFalse();
  })
});