import { HttpClientModule } from "@angular/common/http";
import { ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { Post } from "src/app/model/Post";
import { PostUpload } from "src/app/model/PostUpload";
import { User } from "src/app/model/User";
import { PostService } from "src/app/services/post/post.service";
import { DeletePostModalComponent } from "../delete-post-modal/delete-post-modal.component";
import { UserService } from "src/app/services/user/user.service";
import { UpdatePostModalComponent } from "../update-post-modal/update-post-modal.component";

import { UserInfoComponent } from "./user-info.component";
import { Router } from "@angular/router";

let fakePost = new Post(0, "", "", "", "", "", 0, 0);

describe("UserInfoComponent", () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    postServiceSpy = jasmine.createSpyObj("PostService", ["updatePostDescription", "emitMessageChange"]);
    userServiceSpy = jasmine.createSpyObj("UserService", ["isAdmin"]);

    await TestBed.configureTestingModule({
      declarations: [UserInfoComponent, UpdatePostModalComponent],
      imports: [MatMenuModule, MatDialogModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        MatDialog,
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: PostService, useValue: postServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should test onDelete method", () => {
    spyOn(component.dialog, "open").and.callThrough();

    //TODO:fix this later
    component.onDelete();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it("openSpecificDialog should open UpdatePostModal and send a PostUpload object", () => {
    component.post = fakePost;
    spyOn(component.dialog, "open").and.callThrough();
    component.openSpecificDialog();
    expect(component.dialog.open).toHaveBeenCalledWith(UpdatePostModalComponent, {
      height: "25rem",
      width: "35rem",
      hasBackdrop: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
      data: {
        postUpload: new PostUpload(fakePost.id, fakePost.imageUrl, fakePost.message),
      },
    });
  });

  it("dialogRef.afterClosed should be called on openSpecificDialog and call postService when returning 'Submit'", () => {
    postServiceSpy.updatePostDescription.and.returnValue(of(true));
    component.post = fakePost;
    component.user = new User(0, "", "", "", "", 0, 0, "");
    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({ action: "Submit", message: "" }),
    } as MatDialogRef<UpdatePostModalComponent>);
    component.openSpecificDialog();
    expect(postServiceSpy.updatePostDescription).toHaveBeenCalled();
  });

  it("postService updatePostDescription should console log error on bad response", () => {
    postServiceSpy.updatePostDescription.and.returnValue(
      throwError(() => {
        status: 404;
      })
    );
    component.post = fakePost;
    component.user = new User(0, "", "", "", "", 0, 0, "");
    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({ action: "Submit", message: "" }),
    } as MatDialogRef<UpdatePostModalComponent>);
    component.openSpecificDialog();
    expect(postServiceSpy.updatePostDescription).toHaveBeenCalled();
  });
  it("dialogRef.afterClosed should be called on onDelete and create custome event and dispatch it'", () => {
    let fakePost = new Post(0, "", "", "", "", "", 0, 0);
    component.post = fakePost;
    let event: CustomEvent = new CustomEvent("deletePost", {
      bubbles: true,
      detail: fakePost,
    });
    spyOn(window, "CustomEvent").and.returnValue(event);
    spyOn(window, "dispatchEvent");
    // try callthrough if not working
    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of(fakePost),
    } as MatDialogRef<DeletePostModalComponent>);
    component.onDelete();
    expect(window.CustomEvent).toHaveBeenCalled();
  });

  it("should display breadcrumb menu on all posts if user is admin", () => {
    userServiceSpy.isAdmin.and.returnValue(true);
    component.user = new User(0, "", "", "", "", 0, 0, "");
    component.post = new Post(0, "otheruser", "", "", "", "", 0, 0);

    spyOn(component, "shouldDisplayMenu").and.callThrough();
    expect(component.shouldDisplayMenu()).toBeTrue();
  });

  it("should display breadcrumb menu on posts if usernames match", () => {
    userServiceSpy.isAdmin.and.returnValue(false);
    component.user = new User(0, "user", "", "", "", 0, 0, "");
    component.post = new Post(0, undefined, "user", "", "", "", 0, 0);

    spyOn(component, "shouldDisplayMenu").and.callThrough();

    expect(component.shouldDisplayMenu()).toBeTrue();
  });

  it("should NOT display breadcrumb menu if usernames dont match and user is not admin ", () => {
    userServiceSpy.isAdmin.and.returnValue(false);
    component.user = new User(0, "", "", "", "", 0, 0, "");
    component.post = new Post(0, undefined, "otheruser", "", "", "", 0, 0);

    spyOn(component, "shouldDisplayMenu").and.callThrough();

    expect(component.shouldDisplayMenu()).toBeFalse();
  });
  it("should not display menu if user is not logged in", () => {
    userServiceSpy.isAdmin.and.returnValue(false);
    component.user = new User();
    component.post = new Post(0, "", "otheruser", "", "", "", 0, 0);

    spyOn(component, "shouldDisplayMenu").and.callThrough();

    expect(component.shouldDisplayMenu()).toBeFalse();
  });

  it("onProfileClick should navigate to target usernames profile page", () => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    component.onProfileClick("user");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["user", "user"]);
  });
});
