import { HttpClient, HttpClientModule, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { of, throwError, windowWhen } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { UserService } from "./user.service";
import * as jwtDecode from 'jwt-decode';
import { RegisterComponent } from "src/app/components/auth/register/register.component";

describe("UserService", () => {
  let service: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let ActivatedRouteSnapshotspy : jasmine.SpyObj<ActivatedRouteSnapshot>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "put", "patch", "delete"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    userServiceSpy = jasmine.createSpyObj("UserService", ["getTokenFromLocalStorage"]);
    ActivatedRouteSnapshotspy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['component']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
        {provide : ActivatedRouteSnapshot, useValue : ActivatedRouteSnapshotspy},
      ],
    });
    service = TestBed.inject(UserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Login should make http post request", () => {
    const returnVal = {
      access_token: "string",
      expires_in: 0,
      refresh_expires_in: 0,
      refresh_token: "string",
      token_type: "string",
      session_state: "string",
      scope: "string",
      notBeforePolicy: 0,
    };

    httpClientSpy.post.and.returnValue(of(returnVal));
    service.login("user", "pass").subscribe(() => {
      expect(httpClientSpy.post).toHaveBeenCalled();
    });
  });


  it("getUser should get the logged in user", () => {
    // let baseUrl: string = "https://pixelgram-backend.work.cognizant.studio/";
    httpClientSpy.get.and.returnValue(of({}));
    service.getUser("mrbossman");
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.baseUrl + "users" + "?filter=mrbossman&pageNumber=0&pageSize=100");
  });

  it('logout() should remove userToken from localStorage and create a POST request', () => {
    let service = TestBed.inject(UserService)

    httpClientSpy.post.and.returnValue(of(true));

    service.logout("string");

    expect(httpClientSpy.post).toHaveBeenCalled()
  });

  it(`should test gaurdAuthRoutes() method if user is logged in`, ()=>{
    const obj = {isAuth : true};
    const result = service.gaurdAuthRoutes(obj);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
  it(`should test gaurdAuthRoutes() method if user is NOT logged in`, ()=>{
    const obj = null;
    const result = service.gaurdAuthRoutes(obj);
    expect(result).toBeTruthy();
  })
  it(`should test gaurdNonAuthRoutes() method if user is logged in`, ()=>{
    const obj = {isAuth : true};
    const result = service.gaurdNonAuthRoutes(obj);
    expect(result).toBeTruthy();
  });
  it(`should test gaurdNonAuthRoutes() method is user is NOT logged in`, ()=>{
    const obj = null;
    const result = service.gaurdNonAuthRoutes(obj);
    expect(result).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
  it(`should test canActive() method if gaurdAuthRoute is called`, ()=>{
    ActivatedRouteSnapshotspy.component = RegisterComponent ;
    const tokenSpy = spyOn(service, "getTokenFromLocalStorage").and.returnValue({val : 'token'});
    const getAuthrouteSpy = spyOn(service, "gaurdAuthRoutes");
    service.canActivate(ActivatedRouteSnapshotspy);
    expect(getAuthrouteSpy).toHaveBeenCalled();
  });
  it(`should test canActive() method if gaurdNonAuthRoute is called`, ()=>{
    ActivatedRouteSnapshotspy.component = null;
    const tokenSpy = spyOn(service, "getTokenFromLocalStorage").and.returnValue({val : 'token'});
    const getNonAuthrouteSpy = spyOn(service, "gaurdNonAuthRoutes");
    service.canActivate(ActivatedRouteSnapshotspy);
    expect(getNonAuthrouteSpy).toHaveBeenCalled();
  });

  it('follow should make a http post call to the correct end point', () => {
    const returnVal = {
      follower: {
        id: 0,
        username: "string",
        profileImageUrl: "string",
        name: "string",
        bio: "string",
        followerCount: 0,
        followingCount: 0
      },
      followed: {
        id: 0,
        username: "string",
        profileImageUrl: "string",
        name: "string",
        bio: "string",
        followerCount: 0,
        followingCount: 0
      }
    }
    const tokenSpy = spyOn(service, "getTokenFromLocalStorage").and.returnValue({val : 'token'});
    httpClientSpy.post.and.returnValue(of(returnVal));
    service.follow('username');
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it('unfollow should call http delete', () => {
    const tokenSpy = spyOn(service, "getTokenFromLocalStorage").and.returnValue({val : 'token'});
    httpClientSpy.delete.and.returnValue(of(true));
    service.unfollow('username');
    expect(httpClientSpy.delete).toHaveBeenCalled();
  });

  it('getFollowers should make http get request with the correct parameters', () => {
    const returnVal = {
      id: 0,
      username: "string",
      profileImageUrl: "string",
      name: "string",
      bio: "string",
      followerCount: 0,
      followingCount: 0
    }
    httpClientSpy.get.and.returnValue(of(returnVal));
    service.getFollowers('username');
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.baseUrl+"users/username/followers");
  });

  it('getFollowings should make http get request with the correct parameters', () => {
    const returnVal = {
      id: 0,
      username: "string",
      profileImageUrl: "string",
      name: "string",
      bio: "string",
      followerCount: 0,
      followingCount: 0
    }
    httpClientSpy.get.and.returnValue(of(returnVal));
    service.getFollowings('username');
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.baseUrl+"users/username/followings");
  });
  it('editUserInfo() should make a PATCH request with the correct url/params', () => {
    httpClientSpy.patch.and.returnValue(of(true));
    service.editUserInfo('name', 'bio').subscribe((response) => expect(response).toBeTruthy())
  })

  it('editUserPicture() should make a PATCH request with the correct url/params', () => {
    httpClientSpy.patch.and.returnValue(of(true));
    service.editUserPicture('file').subscribe((response) => expect(response).toBeTruthy())
  })

  it('deleteUserPicture() should make a DELETE request with the correct url/params', () => {
    httpClientSpy.delete.and.returnValue(of(true));
    service.deleteUserPicture().subscribe((response) => expect(response).toBeTruthy())
  })

});
