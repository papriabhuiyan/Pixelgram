import { HttpClient, HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { RegisterService } from "src/app/services/user/register/register.service";

import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient }, { provide: RegisterService }],
      declarations: [RegisterComponent],
    }).compileComponents();

    /* Local Storage Mock */
    var store: any = {};
    spyOn(localStorage, 'getItem').and.callFake( (key:string):string => {
     return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key:string):void =>  {
      delete store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key:string, value:string):string =>  {
      return store[key] = <string>value;
    });
    spyOn(localStorage, 'clear').and.callFake(() =>  {
        store = {};
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('submit() should save user refresh token', () => {
    let service = component.registerService
    spyOn(service, 'registerUser').and.returnValue(of({
      access_token: "string",
      expires_in: 0,
      refresh_expires_in: 0,
      refresh_token: "string",
      token_type: "string",
      session_state: "string",
      scope: "string",
      notBeforePolicy: 0,
    }))
    spyOn(component, 'submit').and.callThrough()
  
    const dummyUser = {
      username: "user",
      password: "password",
    };

    component.submitted = false;
    fixture.detectChanges();

    component.regForm.patchValue(dummyUser);
    fixture.detectChanges();

    let regForm = fixture.nativeElement.querySelector('[data-test-id="reg-form"]');
    let userNameTextBox = fixture.nativeElement.querySelector('[data-test-id="username"]');
    let passwordTextBox = fixture.nativeElement.querySelector('[data-test-id="password"]');

    component.submit();
    expect(component.submit).toHaveBeenCalled()
    expect(localStorage.getItem('user_token')).toBeTruthy()
  })

  it('submit() should set found to true if registerService returns an error', () => {
    let regService = TestBed.inject(RegisterService)
    spyOn(regService, 'registerUser').and.returnValue(throwError(() => new Error()))
    spyOn(component, 'submit').and.callThrough()
    spyOn(console, 'log')

    component.found = true
    const dummyUser = {
      username: "user",
      password: "password",
    };
    component.regForm.patchValue(dummyUser);
    fixture.detectChanges()

    component.submit()
    fixture.detectChanges()

    expect(component.found).toBeTrue()
  })

  it('setFalse should set found to false', () => {
    spyOn(component, 'setFalse').and.callThrough()
    component.found = true
    
    component.setFalse()
    fixture.detectChanges()

    expect(component.found).toBeFalse()
  })
});