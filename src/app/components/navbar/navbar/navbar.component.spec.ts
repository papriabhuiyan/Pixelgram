import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";
import { EventEmitter, InjectionToken } from "@angular/core";

import { NavbarComponent } from "./navbar.component";
import { AppRoutingModule } from "src/app/app-routing.module";
export const WINDOW = new InjectionToken("Window");

describe("NavbarComponent", () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj("UserService", ["isAuthenticated", "logout", "getTokenFromLocalStorage"]);
    userServiceSpy.getTokenFromLocalStorage.and.returnValue("asdadf");
    routerSpy = jasmine.createSpyObj("Router", ["navigate", "url", "parseUrl"]);
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatMenuModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    var store: any = {};
    spyOn(localStorage, "getItem").and.callFake((key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, "removeItem").and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, "setItem").and.callFake((key: string, value: string): string => {
      return (store[key] = <string>value);
    });
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set isAuthBoolean to true if user is authenticated.", () => {
    expect(component.isAuthBoolean).toBeTrue();
  });

  it("should route to login when null is returned from getTokenFromLocalStorage", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(null);
    component.reRoute();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should route to home and cll userService logout when non null is returned from getTokenFromLocalStorage", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue("token");
    spyOn(component, "pageReload");
    component.reRoute();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
    expect(userServiceSpy.logout).toHaveBeenCalled();
  });

  it("should set onHome to true when router url is /", () => {
    const router = TestBed.get(Router);
    router.url = "/";
    component.ngOnInit();
    expect(component.onHome).toBeTrue();
  });

  it("should test to see if search() emits an event", () => {
    spyOn(component.searchEvent, "emit");
    component.search();
    expect(component.searchEvent.emit).toHaveBeenCalled();
  });

  it("should test checkToggle()", () => {
    localStorage.setItem("toggle", "true");
    component.checkToggle();
    expect(component.toggle.nativeElement.checked).toBeTruthy();
  });

  it("should test darkMode if item exists in local storage", () => {
    localStorage.setItem("toggle", "true");
    localStorage.setItem("theme", "dark-theme");
    component.darkMode();
    expect(component.toggle.nativeElement.checked).toBeFalsy();
  });

  it("should test darkMode if item does not exists in local storage", () => {
    component.darkMode();
    expect(component.toggle.nativeElement.checked).toBeTruthy();
  });
});
