import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expandOnEnterAnimation } from 'angular-animations';
import { of, throwError } from 'rxjs';
import { Post } from 'src/app/model/Post';
import { PostService } from 'src/app/services/post/post.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FollowModalComponent } from '../follow-modal/follow-modal.component';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ProfileComponent } from './profile.component';
import { Follower } from 'src/app/model/Follower';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { User } from 'src/app/model/User';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class dialogMock {
  open() {
    return {
      afterClosed: () => of({}),
    };
  }
}

let MockUser = {
  content: [
    {
      id: 0,
      username: 'user',
      profileImageUrl: '',
      name: 'name',
      bio: 'bio',
      followerCount: 0,
      followingCount: 0
    }
  ]
};
let MockPosts = {
  content: [
    {
      createdOn: "2022-11-04T19:05:41.850+00:00",
      id: 22,
      author: {
        id: 44,
        username: "itysl",
        profileImageUrl: null,
        followerCount: 0,
        followingCount: 0,
      },
      message: "I dont want any questions about the tables",
      imageUrl: "https://i.imgur.com/HSS4BPl.jpeg",
      comments: {
        content: [],
        pageable: {
          sort: {
            sorted: true,
            unsorted: false,
            empty: false,
          },
          pageNumber: 0,
          pageSize: 5,
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 0,
        last: true,
        totalPages: 0,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        numberOfElements: 0,
        first: true,
        size: 5,
        number: 0,
        empty: true,
      },
      likeCount: 0,
      hasLiked: false,
    },
    {
      createdOn: "2022-11-04T18:46:42.851+00:00",
      id: 21,
      author: {
        id: 21,
        username: "maxim",
        profileImageUrl: null,
        followerCount: 1,
        followingCount: 1,
      },
      message: "Vube ",
      imageUrl: "https://i.imgur.com/gbMkrmV.png",
      comments: {
        content: [],
        pageable: {
          sort: {
            sorted: true,
            unsorted: false,
            empty: false,
          },
          pageNumber: 0,
          pageSize: 5,
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 0,
        last: true,
        totalPages: 0,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        numberOfElements: 0,
        first: true,
        size: 5,
        number: 0,
        empty: true,
      },
      likeCount: 1,
      hasLiked: false,
    },
  ],
};
let MockPostsWithHasLiked = {
  content: [
    {
      id: 0,
      author: {
        username: 'user',
        profileImageUrl: 'url',
      },
      message: 'message',
      imageUrl: 'imgUrl',
      likeCount: 0,
      comments: {
        content: [
          0, 1, 2
        ]
      },
      hasLiked: true
  },
  {
    id: 1,
    author: {
      username: 'user2',
      profileImageUrl: 'url',
    },
    message: 'message',
    imageUrl: 'imgUrl',
    likeCount: 0,
    comments: {
      content: [
        0, 1, 2
      ]
    },
    hasLiked: true
}
]}
let followersReturn = [
  {
    id: 0,
    username: "test",
    profileImageUrl: "test",
    name: "test",
    bio: "test",
    followerCount: 0,
    followingCount: 0
  },
  {
    id: 0,
    username: "test1",
    profileImageUrl: "test1",
    name: "test1",
    bio: "test1",
    followerCount: 0,
    followingCount: 0
  }
]
let fakeToken = {
  access_token: "string",
  expires_in: 7200,
  not_before_policy: 1663364747,
  refresh_expires_in: 7200,
  refresh_token: "string",
  scope: "email profile",
  session_state: "string",
  token_type: "Bearer",
  username: "username"
}
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
const data = {
  following: false,
  followers: [],
};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let dialog: any;
  let matDialogSpy: jasmine.SpyObj<MatDialog>

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', 
    [
        'getFollowers', 
        'getFollowings', 
        'follow', 
        'unfollow', 
        'getTokenFromLocalStorage', 
        'getUser', 
        'isAdmin',
        'editUserInfo',
        'editUserPicture',
        'deleteUserPicture'
    ]);
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByUsername', 'getPostsWithHasLikedProfile']);
    //matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeDialog', 'open', 'componentInstance', 'afterClosed']);

    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent, FollowModalComponent ],
      imports: [
        RouterModule, 
        RouterTestingModule, 
        HttpClientModule, 
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 123, username: 'user' })} },
        { provide: UserService, useValue: userServiceSpy },
        //{ provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {
          followers: [],
          following: false
        }},
        { provide: MatDialog, useValue: new dialogMock() },
        { provide: HttpClient },
        { provide: HttpHandler }
      ]
    })

    fixture = TestBed.createComponent(ProfileComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should intialize profile user, signed in user, and posts using fetchPosts() if user is NOT authenticated', () => {
    userServiceSpy.getUser.and.returnValue(of(MockUser));
    postServiceSpy.getPostsByUsername.and.returnValue(of(true));
    userServiceSpy.getFollowers.and.returnValue(of(followersReturn));

    const fetchPostsSpy = spyOn(component, 'fetchPosts');
    const fetchSignedInUser = spyOn(component, 'fetchSignedInUser');

    component.ngOnInit();

    expect(fetchPostsSpy).toHaveBeenCalled();
    expect(fetchSignedInUser).toHaveBeenCalled();
  });

  it('ngOnInit() should intialize profile user, signed in user, and posts using fetchPostsByUsername() if user is authenticated', () => {
    userServiceSpy.getUser.and.returnValue(of(MockUser));
    postServiceSpy.getPostsByUsername.and.returnValue(of(true));
    userServiceSpy.getFollowers.and.returnValue(of(followersReturn));

    userServiceSpy.getTokenFromLocalStorage.and.returnValue({ access_token: '' })

    const fetchPostsSpy = spyOn(component, 'fetchPostsByUsername');
    const fetchSignedInUser = spyOn(component, 'fetchSignedInUser');

    component.ngOnInit();

    expect(fetchPostsSpy).toHaveBeenCalled();
    expect(fetchSignedInUser).toHaveBeenCalled();
  });

  it("messageChangeEvent should update posts on edit description", () => {
    userServiceSpy.getUser.and.returnValue(of(MockUser));
    postServiceSpy.getPostsByUsername.and.returnValue(of(true));
    userServiceSpy.getFollowers.and.returnValue(of(followersReturn));

    component.posts = [new Post(0, "otheruser", "", "", "", "", 0, 0)];

    let service = TestBed.inject(PostService);
    spyOn(component, "ngOnInit").and.callThrough();

    // component.ngOnInit();
    service.messageChangeEvent.next({ id: 0, message: "new" });
    fixture.detectChanges();

    expect(component.posts[0].message).toEqual("new");
  });

  it("fetchPosts() should set posts filtered by profile username", () => {
    let service = TestBed.inject(PostService);
    spyOn(component, "fetchPosts").and.callThrough();
    spyOn(service, "getPostsByUsername").and.callFake(() => {
      return of(MockPosts);
    });

    component.fetchPosts();
    fixture.detectChanges();

    expect(component.fetchPosts).toHaveBeenCalledWith();
    expect(component.posts.length).toEqual(2);
  });

  it("fetchPosts() should log if error occurs getting posts", () => {
    let service = TestBed.inject(PostService);
    spyOn(service, "getPostsByUsername").and.returnValue(throwError(() => new Error()));
    spyOn(component, "fetchPosts").and.callThrough();
    spyOn(console, "log");

    component.fetchPosts();
    expect(console.log).toHaveBeenCalled();
  });

  it('fetchPostsByUsername should call postService.getPostsWithHasLikedProfile() and add posts to array', () => {
    let postService = TestBed.inject(PostService)
    spyOn(postService, 'getPostsWithHasLikedProfile').and.returnValue(of(MockPostsWithHasLiked))
    spyOn(component, 'fetchPostsByUsername').and.callThrough()

    component.posts = []
    component.fetchPostsByUsername()
    fixture.detectChanges()

    expect(postService.getPostsWithHasLikedProfile).toHaveBeenCalled()
    expect(component.posts.length).not.toBe(0)
  });

  it('fetchPostsByUsername should log if error occurs getting posts', () => {
    let postService = TestBed.inject(PostService)
    spyOn(postService, "getPostsWithHasLikedProfile").and.returnValue(throwError(() => new Error()));
    spyOn(console, "log");

    component.fetchPostsByUsername();
    expect(console.log).toHaveBeenCalled();
  })

  it('user object should contain default values if user not signed in', () => {
    component.fetchSignedInUser();
    expect(component.signedInUser.username).toEqual('DEFAULT');
  });

  
  it('onEditProfile should open EditProfile modal and call editUserInfo and editUserPicture if not null', () => {
    userServiceSpy.editUserInfo.and.returnValue(of(true));
    userServiceSpy.editUserPicture.and.returnValue(of(true));
    spyOn(component, 'reload').and.callFake(() => {})

    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({ message: 'Submit', file: new File([""], "filename", { type: 'text/html' }) }),
    } as MatDialogRef<EditProfileComponent>)

    component.onEditProfile()
  });

  it('onCustomEventCaptured() should remove post with same id as event', () => {
    const testPosts = [
      new Post(0, "otheruser", "", "", "", "", 0, 0),
      new Post(1, "otheruser", "", "", "", "", 0, 0),
      new Post(2, "otheruser", "", "", "", "", 0, 0),
    ];
    component.posts = testPosts;

    component.onCustomEventCaptured({ detail: 1 })

    expect(component.posts).toEqual(testPosts)
  });

  it("breadcrumbs should NOT display anywhere if username is 'DEFAULT'", () => {
    spyOn(component, "shouldDisplayMenu").and.callThrough();
    expect(component.shouldDisplayMenu()).toBeFalse();
  });

  it('breadcrumbs should display if user is admin', () => {
    userServiceSpy.isAdmin.and.returnValue(true);
    component.user = new User(0, '','','','',0,0,'');

    spyOn(component, "shouldDisplayMenu").and.callThrough();
    expect(component.shouldDisplayMenu()).toBeFalse();
  });

  it('breadcrumbs should display if profile user and signed in user are equivalent', () => {
    component.user = new User(0, '','','','',0,0,'');
    
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(new User(0, '','','','',0,0,''));

    spyOn(component, "shouldDisplayMenu").and.callThrough();
    expect(component.shouldDisplayMenu()).toBeTrue();
  });

  it('breadcrumbs should NOT display if profile user and signed in user are NOT equivalent', () => {
    component.user = new User(0, '','','','',0,0,'');
    
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(new User(0, 'otheruser','','','',0,0,''));

    spyOn(component, "shouldDisplayMenu").and.callThrough();
    expect(component.shouldDisplayMenu()).toBeFalse();
  })

  // ---------------------------------------------------------------------
  // follow tests below (merge divider)

  it('getFollowers should call user service get followers method', () => {
    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({}),
    } as MatDialogRef<FollowModalComponent>)
    userServiceSpy.getFollowers.and.returnValue(of(followersReturn));
    component.user.username = "username";
    component.getFollowers();
    expect(userServiceSpy.getFollowers).toHaveBeenCalled();
  });

  it('getFollowing hould call user service get following method', () => {
    spyOn(component.dialog, "open").and.returnValue({
      afterClosed: () => of({}),
    } as MatDialogRef<FollowModalComponent>)
    userServiceSpy.getFollowings.and.returnValue(of(followersReturn));
    component.user.username = "username";
    component.getFollowing();
    expect(userServiceSpy.getFollowings).toHaveBeenCalled();
  });

  it('follow should call user service follow method', () => {
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
    component.user.username = "username";
    userServiceSpy.follow.and.returnValue(of(returnVal));
    component.follow();
    expect(userServiceSpy.follow).toHaveBeenCalledWith("username");
  });

  it('unfollow should call user service follow method', () => {
    component.user.username = "username";
    userServiceSpy.unfollow.and.returnValue(of(true));
    component.unfollow();
    expect(userServiceSpy.unfollow).toHaveBeenCalledWith("username");
  });

  it('ngOninit should call userService getFollowers and getTokenFromLocalStorage', () => {
    userServiceSpy.getUser.and.returnValue(of(fakeResponse));
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(of(fakeToken));
    userServiceSpy.getFollowers.and.returnValue(of(followersReturn));
    component.ngOnInit();
    expect(userServiceSpy.getUser).toHaveBeenCalled();
    expect(userServiceSpy.getFollowers).toHaveBeenCalled();
    expect(userServiceSpy.getTokenFromLocalStorage).toHaveBeenCalled();
  });

  it('onEditProfile should open a dialog and on close with message Success should reload the page', () => {
    spyOn(component, 'onEditProfile').and.callThrough()
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of({message: "Success", file: undefined})} as MatDialogRef<FollowModalComponent>);
    spyOn(component, 'reload').and.callFake(() => {})
    
    component.onEditProfile()

    expect(component.dialog.open).toHaveBeenCalled()
  })
  it('onEditProfile should open dialog and on close with message Delete should call deleteUserPicture in userService', () => {
    spyOn(component, 'onEditProfile').and.callThrough()
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of({message: "Delete", file: undefined})} as MatDialogRef<FollowModalComponent>);
    spyOn(component, 'reload').and.callFake(() => {})
    userServiceSpy.deleteUserPicture.and.returnValue(of(true))

    component.onEditProfile()

    expect(component.dialog.open).toHaveBeenCalled()
    expect(userServiceSpy.deleteUserPicture).toHaveBeenCalled()
  })
  it('onEditProfile should open dialog and on close with message Submit should call editUserInfo and editUserPicture in userService', () => {
    spyOn(component, 'onEditProfile').and.callThrough()
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of({message: "Submit", file: new Blob()})} as MatDialogRef<FollowModalComponent>);
    spyOn(component, 'reload').and.callFake(() => {})
    userServiceSpy.editUserInfo.and.returnValue(of(true))
    userServiceSpy.editUserPicture.and.returnValue(of(true))

    component.onEditProfile()

    expect(component.dialog.open).toHaveBeenCalled()
    expect(userServiceSpy.editUserInfo).toHaveBeenCalled()
    expect(userServiceSpy.editUserPicture).toHaveBeenCalled()
  })
});

