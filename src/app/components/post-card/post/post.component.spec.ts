import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Post } from "src/app/model/Post";
import { UserService } from "src/app/services/user/user.service";
import { PostComponent } from "./post.component";
import { PostService } from "src/app/services/post/post.service";
import { of } from "rxjs";
import { compileNgModule, isNgTemplate } from "@angular/compiler";
import { ɵpatchComponentDefWithScope } from "@angular/core";
import { Router } from "@angular/router";

describe("PostComponent", () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  // let userservice: UserService;
  // let postservice: PostService;
  let fakePostShortMessage = new Post(1,"fake", "username", "none", "hello", "none", 1, 1);
  let fakePostLongMessage = new Post(
    1,
    "createdOn",
    "username",
    "none",
    "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello",
    "none",
    1,
    1
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [PostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("messageTruncated should be false if message less than messageThreshold", () => {
    component.post = fakePostShortMessage;
    component.ngOnInit();

    let t = component.messageThreshold;
    let m = component.post.message.length;

    expect(m).toBeLessThan(t);
    expect(component.messageTruncated).toBeTrue;
  });
  it("messageTruncated should  be true if message more than messageThreshold", () => {
    component.post = fakePostLongMessage;
    component.ngOnInit();

    let t = component.messageThreshold;
    let m = component.post.message.length;

    expect(t).toBeLessThan(m);
    expect(component.messageTruncated).toBeTrue;
  });

  it("should set messageTrunctaed to false when expandMessage is called", () => {
    component.messageTruncated = true;

    component.expandMessage();

    expect(component.messageTruncated).toBeFalse;
  });

  it("if updated message is greater than the messageThreshold - messageTruncated should be true", () => {
    let service = TestBed.inject(PostService);
    spyOn(component, "ngOnInit").and.callThrough();

    component.ngOnInit();
    service.messageChangeEvent.next({ id: 0, message: fakePostLongMessage.message });
    fixture.detectChanges();

    expect(component.messageTruncated).toBeTrue();
  });

  it("if updated message is leess than the messageThreshold - messageTruncated should be true", () => {
    let service = TestBed.inject(PostService);
    spyOn(component, "ngOnInit").and.callThrough();

    component.ngOnInit();
    service.messageChangeEvent.next({ id: 0, message: fakePostShortMessage.message });
    fixture.detectChanges();

    expect(component.messageTruncated).toBeFalse();
  });

  it("postLikeAction() should should call post service addLikeToPost function if the user has liked", () => {
    let userService = TestBed.inject(UserService);
    let postService = TestBed.inject(PostService);
    component.liked = false;

    spyOn(component, "postLikeAction").and.callThrough();
    spyOn(userService, "getTokenFromLocalStorage").and.returnValue({ access_token: "token" });
    spyOn(postService, "addLikeToPost").and.returnValue(of(true));

    component.postLikeAction();

    expect(component.liked).toBeTrue();
    expect(postService.addLikeToPost).toHaveBeenCalled();
  });

  it("postLikeAction() should should call post service deleteLikeToPost function if the user has not liked", () => {
    let userService = TestBed.inject(UserService);
    let postService = TestBed.inject(PostService);
    component.liked = true;

    spyOn(component, "postLikeAction").and.callThrough();
    spyOn(userService, "getTokenFromLocalStorage").and.returnValue({ access_token: "token" });
    spyOn(postService, "deleteLikeToPost").and.returnValue(of(true));

    component.postLikeAction();

    expect(component.liked).toBeFalse();
    expect(postService.deleteLikeToPost).toHaveBeenCalled();
  });

  it("should set liked property to true of passed post object is liked", () => {
    spyOn(component, "ngOnInit").and.callThrough();
    component.post = new Post(0,"", "", "", "", "", 1, 0, true);

    component.ngOnInit();
    expect(component.liked).toBeTrue();
  });
  it("toggleZoom should toggle zoom", () => {
    spyOn(component, "toggleZoom").and.callThrough();
    component.zoom = false;

    component.toggleZoom();

    expect(component.zoom).toBeTrue();
  });
  it("should call postLikeAction on double click on post", () => {
    spyOn(component, "onPostDoubleClick").and.callThrough();
    spyOn(component, "postLikeAction");

    component.onPostDoubleClick();

    expect(component.postLikeAction).toHaveBeenCalled();
  });

  it('onProfileClick should navigate to target usernames profile page', () => {
    let router = TestBed.inject(Router);
    let routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.onProfileClick('user');
    expect(routerSpy).toHaveBeenCalledWith(['user', 'user']);
  })

});
