import { HttpClient, HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable, of, throwError } from "rxjs";
import { Post } from "src/app/model/Post";
import { PostService } from "src/app/services/post/post.service";
import { UserService } from "src/app/services/user/user.service";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { PostComponent } from "../post-card/post/post.component";
import { NavbarComponent } from "../navbar/navbar/navbar.component";

import { LandingComponent } from "./landing.component";

describe("LandingComponent", () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockPosts = {
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
  let mockPostsWithHasLiked = {
    content: [
      {
        id: 0,
        createdOn: "fake",
        author: {
          username: "user",
          profileImageUrl: "url",
        },
        message: "message",
        imageUrl: "imgUrl",
        likeCount: 0,
        comments: {
          content: [0, 1, 2],
        },
        hasLiked: true,
      },
      {
        id: 1,
        createdOn: "fake",
        author: {
          username: "user2",
          profileImageUrl: "url",
        },

        message: "message",
        imageUrl: "imgUrl",
        likeCount: 0,
        comments: {
          content: [0, 1, 2],
        },
        hasLiked: true,
      },
    ],
  };
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj("PostService", ["getPosts", "getPostsWithHasLiked", "getPostByDesc", "getPostByUser"]);
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));
    postServiceSpy.getPostsWithHasLiked.and.returnValue(of(mockPosts));
    userServiceSpy = jasmine.createSpyObj("UserService", ["getTokenFromLocalStorage", "getUser"]);
    userServiceSpy.getUser.and.returnValue(of({}));
    userServiceSpy.getTokenFromLocalStorage.and.returnValue({});

    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("fetchPosts() should call PostService and append response posts to local posts array", () => {
    let service = TestBed.inject(PostService);
    spyOn(component, "fetchPosts").and.callThrough();
    spyOn(service, "getPosts").and.callFake(() => {
      return of(mockPosts);
    });

    component.fetchPosts();
    fixture.detectChanges();

    expect(component.fetchPosts).toHaveBeenCalledWith();
    expect(component.posts.length).toEqual(2);
  });

  it("fetchPosts() should log if error occurs getting posts", () => {
    let service = TestBed.inject(PostService);
    spyOn(service, "getPosts").and.returnValue(throwError(() => new Error()));
    spyOn(component, "fetchPosts").and.callThrough();
    spyOn(console, "log");

    component.fetchPosts();
    expect(console.log).toHaveBeenCalled();
  });

  it("onScroll() should increment currentPageNumber by 1 and fetchPosts again", () => {
    component.userInput = "";
    component.currentPageNumber = 0;
    spyOn(component, "onScroll").and.callThrough();
    spyOn(component, "fetchPosts");

    component.onScroll();
    fixture.detectChanges();

    expect(component.currentPageNumber).toEqual(1);
    expect(component.fetchPosts).toHaveBeenCalled();
  });

  it("on a new messageChangeEvent, matching post message should be updated", () => {
    component.posts = [new Post(0, "", "", "", "old", "", 0, 0)];

    let service = TestBed.inject(PostService);
    spyOn(component, "ngOnInit").and.callThrough();

    component.ngOnInit();
    service.messageChangeEvent.next({ id: 0, message: "new" });
    fixture.detectChanges();

    expect(component.posts[0].message).toEqual("new");
  });

  it("fetchPostsByUsername should call postService.getPosts() and add posts to array", () => {
    let postService = TestBed.inject(PostService);
    spyOn(postService, "getPostsWithHasLiked").and.returnValue(of(mockPostsWithHasLiked));
    spyOn(component, "fetchPostsByUsername").and.callThrough();

    component.posts = [];
    component.fetchPostsByUsername();
    fixture.detectChanges();

    expect(postService.getPostsWithHasLiked).toHaveBeenCalled();
    expect(component.posts.length).not.toBe(0);
  });

  it("fetchUser() should call getUser() and set user object", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue({ username: "user" });
    userServiceSpy.getUser.and.returnValue(of(true));

    spyOn(component, "fetchUser").and.callThrough();

    component.fetchUser();
    expect(component.user.username).toEqual("DEFAULT");
  });

  it("fetchUser() should NOT set user if getTokenFromLocalStorage() returns null", () => {
    let service = TestBed.inject(UserService);
    spyOn(service, "getTokenFromLocalStorage").and.returnValue(null);

    component.fetchUser();

    expect(component.user.username).toEqual("DEFAULT");
  });

  it("onCustomEventCaptured() should remove post with same id as event", () => {
    const testPosts = [
      new Post(0, "", "", "", "", "", 0, 0, false),
      new Post(1, "", "", "", "", "", 0, 0, false),
      new Post(2, "", "", "", "", "", 0, 0, false),
    ];
    component.posts = testPosts;

    component.onCustomEventCaptured({ detail: 1 });

    expect(component.posts).toEqual(testPosts);
  });

  it("fetchPostsByUsername should log error if getPostsWithHasLiked returns an error", () => {
    let postService = TestBed.inject(PostService);
    spyOn(postService, "getPostsWithHasLiked").and.returnValue(throwError(() => new Error()));
    spyOn(console, "log");
    spyOn(component, "fetchPostsByUsername").and.callThrough();

    component.posts = [];
    component.fetchPostsByUsername();
    fixture.detectChanges();

    expect(console.log).toHaveBeenCalled();
    expect(component.posts.length).toBe(0);
  });

  it("searchPost should call searchIsEmpty", () => {
    const obj = { input: "", filter: "username" };
    spyOn(component, "searchIsEmpty");
    component.searchPost(obj);
    expect(component.searchIsEmpty).toHaveBeenCalled();
  });

  it("searchPost should call searchByUsername", () => {
    const obj = { input: "something", filter: "Username" };
    spyOn(component, "searchByUsername");
    component.searchPost(obj);
    expect(component.searchByUsername).toHaveBeenCalled();
  });

  it("searchPost should call searchByDescription", () => {
    const obj = { input: "something", filter: "Description" };
    spyOn(component, "searchByDescription");
    component.searchPost(obj);
    expect(component.searchByDescription).toHaveBeenCalled();
  });

  it("searchIsEmpty should call fetchPostsByUsername()", () => {
    let service = TestBed.inject(UserService);
    spyOn(service, "getTokenFromLocalStorage").and.returnValue(true);

    spyOn(component, "fetchPostsByUsername");
    component.searchIsEmpty();
    expect(component.fetchPostsByUsername).toHaveBeenCalled();
  });

  it("should test searchByDescription()", () => {
    const service = TestBed.inject(PostService);
    spyOn(service, "getPostByDesc").and.returnValue(of(mockPosts));
    component.searchByDescription("car");
    expect(service.getPostByDesc).toHaveBeenCalled();
  });

  it("should test searchByUsername()", () => {
    const service = TestBed.inject(PostService);
    spyOn(service, "getPostByUser").and.returnValue(of(mockPosts));
    component.searchByUsername("car");
    expect(service.getPostByUser).toHaveBeenCalled();
  });
});
