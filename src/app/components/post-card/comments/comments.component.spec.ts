import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostComment } from 'src/app/model/Comment';
import { PostService } from 'src/app/services/post/post.service';
import { environment } from 'src/environments/environment';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
} from '@angular/material/dialog';
import { CommentsComponent } from './comments.component';
import { Post } from 'src/app/model/Post';
import { User } from 'src/app/model/User';
import { Router } from '@angular/router';

class dialogMock {
  open() {
    return {
      afterClosed: () => of({}),
    };
  }
}

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let baseURL: string = environment.baseUrl;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let fakeResponse = {
    "totalPages": 0,
    "totalElements": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    },
    "numberOfElements": 0,
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": true,
        "empty": true
      },
      "pageNumber": 0,
      "pageSize": 0,
      "paged": true,
      "unpaged": true,
      "offset": 0
    },
    "first": true,
    "last": true,
    "size": 0,
    "content": [
      {
        "createdOn": "2022-11-09T19:57:06.384Z",
        "id": 0,
        "postId": 0,
        "author": {
          "id": 0,
          "username": "string",
          "profileImageUrl": "string",
          "followerCount": 0,
          "followingCount": 0
        },
        "message": "string"
      }
    ],
    "number": 0,
    "empty": true
  };

  let fakeComments = [
    new PostComment("", 0, 0, {id: 0,username: "", name: "", bio: "", profileImageUrl: "",followerCount: 0, followingCount: 0, accessToken: ''}, ""),
    new PostComment("", 1, 1, {id: 1,username: "",name: "", bio: "",profileImageUrl: "",followerCount: 1, followingCount: 1, accessToken: ''}, "")
  ];
  let dialog: any;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    postServiceSpy = jasmine.createSpyObj("PostService",["getAllComments","postComment"]);
    postServiceSpy.getAllComments.and.returnValue(of(fakeResponse));
    postServiceSpy.postComment.and.returnValue(of(fakeComments[0]));
    httpClientSpy.get.and.returnValue(of(fakeComments));
    await TestBed.configureTestingModule({
      declarations: [ CommentsComponent ],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: new dialogMock() },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getAllComments on when called', () => {
    component.getAllComments(1);
    expect(postServiceSpy.getAllComments).toHaveBeenCalled();
  });

  it('setPostId should set the post to 1 when prompted', () => {
    component.post! = new Post(1,"","","","","",0,0);
    component.setPostId();
    expect(postServiceSpy.postId).toEqual(1);
  });

  it('openDialog should open the add comment modal', () => {
    const spy = spyOn(dialog, 'open').and.callThrough();
    component.openDialog();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('openCommentDialog should open the add comment modal', () => {
    const spy = spyOn(dialog, 'open').and.callThrough();
    component.openCommentDialog();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('if there is more than one comment, viewBool should be true',()=>{
    component.comments.push(fakeComments[0]);
    component.comments.push(fakeComments[1]);
    component.postComment();
    expect(postServiceSpy.postComment).toHaveBeenCalled();
    expect(component.viewBool).toEqual(true);
  });

  it('getAllComments should add comments to list if not undefined',()=>{
    component.contentSection = fakeResponse;
    component.getAllComments(1);
    expect(postServiceSpy.getAllComments).toHaveBeenCalled();
  });

  it('showMoreMessage should show the comment modal', ()=>{
    component.showMoreMessage();
    expect(component.messageLimit).toEqual(50);
  });

  it('onProfileClick should navigate to target usernames profile page', () => {
    let router = TestBed.inject(Router);
    let routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.onProfileClick('user');
    expect(routerSpy).toHaveBeenCalledWith(['user', 'user']);
  })
  
});
 