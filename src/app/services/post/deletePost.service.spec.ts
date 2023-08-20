import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Post } from "../../model/Post";
import { UserService } from "../user/user.service";
import { DeletePostService } from "./deletePost.service";

describe("DeletePostService", () => {
  let service: DeletePostService;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj("UserService", ["getTokenFromLocalStorage"]);
    httpSpy = jasmine.createSpyObj("HttpClient", ["delete"]);
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: HttpClient, useValue: httpSpy },
      ],
    });
    service = TestBed.inject(DeletePostService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should test delete post", () => {
    userServiceSpy.getTokenFromLocalStorage.and.returnValue({ access_token: "access_token" });
    httpSpy.delete.and.returnValue(of(true));
    const fakePost = new Post(1,"fake time", "arvine", "image", "message", "imageURL", 1, 2);

    service.deletePost(fakePost);
    expect(userServiceSpy.getTokenFromLocalStorage).toHaveBeenCalled();
    expect(httpSpy.delete).toHaveBeenCalled();
  });
});
