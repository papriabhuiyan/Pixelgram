import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { PostComment } from "src/app/model/Comment";
import { PostService } from "./post.service";
import { of, subscribeOn, throwError } from "rxjs";
import { User } from "src/app/model/User";
import { UserService } from "../user/user.service";

describe("PostService", () => {
  let service: PostService;
  let baseURL: string = environment.baseUrl;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let fakeComments = [
    new PostComment("", 0, 0, new User(0, "", "", "", "", 0, 0, ""), "hello"),
    new PostComment("", 0, 0, new User(0, "", "", "", "", 0, 0, ""), "hello"),
  ];
  let postHeader = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  let fakeToken = {
    access_token: "test",
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "delete", "put"]);
    httpClientSpy.get.and.returnValue(of(fakeComments));
    httpClientSpy.post.and.returnValue(of(fakeComments[0]));
    userServiceSpy = jasmine.createSpyObj("UserService", ["getTokenFromLocalStorage"]);
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, userValue: userServiceSpy },
      ],
    });
    service = TestBed.inject(PostService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getAllComments should get the apporpriate comments", () => {
    service.getAllComments(1).subscribe(
      //Assert
      (res) => expect(res).toEqual(fakeComments)
    );
    let param = "?postId=1";
    //Assert
    expect(httpClientSpy.get).toHaveBeenCalledWith(baseURL + "posts/1/comments" + param + "&pageNumber=0&pageSize=100");
  });

  it("getPosts() should make a GET request with the correct url/params", () => {
    httpClientSpy.get.and.returnValue(of(true));
    service.getPosts(0).subscribe((response) => expect(response).toBeTruthy());
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.baseUrl + "posts", {
      params: {
        pageSize: 5,
        pageNumber: 0,
      },
    });
  });

  it("updatePostComment() should make a PUT Request to update a posts comment", () => {
    let id = 0;
    let message = "message";

    httpClientSpy.put.and.returnValue(of(true));

    service.updatePostDescription(id, message, "token").subscribe((res) => {
      expect(res).toBeTruthy;
    });
    expect(httpClientSpy.put).toHaveBeenCalled();
  });

  it("emitChangeEvent() should emit a value via the messageChangeEvent BehaviorSubject", () => {
    let data = { id: 0, message: "hello" };
    spyOn(service, "emitMessageChange").and.callThrough();
    spyOn(service.messageChangeEvent, "next");
    service.emitMessageChange(data);

    expect(service.emitMessageChange).toHaveBeenCalled();
    expect(service.messageChangeEvent.next).toHaveBeenCalledWith(data);
  });

  it("getPostsWithHasLiked() should make a GET request with the correct url/params", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(fakeToken);
    httpClientSpy.get.and.returnValue(of(true));
    service.getPostsWithHasLiked(0).subscribe((response) => expect(response).toBeTruthy());

    const options = {
      params: {
        pageNumber: 0,
        pageSize: 5,
      },
      headers: {
        Authorization: `Bearer string`,
      },
    };
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it("addLikeToPost() should make a POST request with the correct url and header", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(fakeToken);
    httpClientSpy.post.and.returnValue(of(true));
    service.addLikeToPost(0).subscribe((response) => expect(response).toBeTruthy());
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer undefined`,
      }),
    };
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it("deleteLikeToPost() should make a DELETE request with the correct url and header", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(fakeToken);
    httpClientSpy.delete.and.returnValue(of(true));
    service.deleteLikeToPost(0).subscribe((response) => expect(response).toBeTruthy());
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer undefined`,
      }),
    };
    expect(httpClientSpy.delete).toHaveBeenCalled();
  });

  it("getPostsByUsername() should make a GET request with the correct url/params", () => {
    httpClientSpy.get.and.returnValue(of(true));
    service.getPostsByUsername(0, "user").subscribe((response) => expect(response).toBeTruthy());
    expect(httpClientSpy.get).toHaveBeenCalledWith(environment.baseUrl + "posts/user", {
      params: {
        pageSize: 1000,
        pageNumber: 0,
      },
    });
  });

  it("upload() should make a POST request with the correct url/params", () => {
    httpClientSpy.post.and.returnValue(of(true));
    service
      .upload(new File([""], "filename", { type: "text/html" }), fakeToken.access_token, "")
      .subscribe((response) => expect(response).toBeTruthy());
  });

  it("should test getPostByDesc with token", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(fakeToken);
    httpClientSpy.get.and.returnValue(of(true));
    service.getPostByDesc("car");
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it("should test getPostByUser with token", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue(fakeToken);
    httpClientSpy.get.and.returnValue(of(true));
    service.getPostByUser("ruthful");
    expect(httpClientSpy.get).toHaveBeenCalled();
  });
});
