import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PostComment } from 'src/app/model/Comment';
import { PostService } from 'src/app/services/post/post.service';
import { ViewCommentModalComponent } from './view-comment-modal.component';

describe('ViewCommentModalComponent', () => {
  let component: ViewCommentModalComponent;
  let fixture: ComponentFixture<ViewCommentModalComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<ViewCommentModalComponent>>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  let fakeComments = [
    new PostComment("", 0, 0, {id: 0,username: "",name: "", bio: "",profileImageUrl: "",followerCount: 0, followingCount: 0, accessToken: ''}, ""),
    new PostComment("", 1, 1, {id: 1,username: "",name: "", bio: "",profileImageUrl: "",followerCount: 1, followingCount: 1, accessToken: ''}, "")
  ];

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
  
  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    postServiceSpy = jasmine.createSpyObj("PostService",["getAllComments"]);
    postServiceSpy.getAllComments.and.returnValue(of(fakeResponse));
    httpClientSpy.get.and.returnValue(of(fakeComments));
    dialogSpy = jasmine.createSpyObj(
      'MatDialogRef<TenantAnnouncementModalComponent>',
      ['close']
    );
    await TestBed.configureTestingModule({
      declarations: [ ViewCommentModalComponent ],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: PostService, useValue: postServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close dialog should close component',() => {
    component.closeDialog();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('getAllComments should add comments to list if not undefined',()=>{
    component.contentSection = fakeResponse;
    component.getAllComments(1);
    expect(postServiceSpy.getAllComments).toHaveBeenCalled();
  });

  it('showMoreMessage should set limit to 255', ()=>{
    component.showMoreMessage(0);
    expect(component.messageLimits[0]).toEqual(255);
  });

  it('showLessMessage should set limit to 125', () => {
    component.showLessMessage(0);
    expect(component.messageLimits[0]).toEqual(125);
  })

  it('onProfileClick should navigate to target usernames profile page', () => {
    let router = TestBed.inject(Router);
    let routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.onProfileClick('user');
    expect(routerSpy).toHaveBeenCalledWith(['user', 'user']);
  })
  
});
