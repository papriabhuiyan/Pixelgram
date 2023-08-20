import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Post } from "../../model/Post";
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from "rxjs";
import { environment } from "src/environments/environment";
import { PostComment } from "src/app/model/Comment";
import { User } from "src/app/model/User";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root",
})
export class PostService {
  public baseURL: string = environment.baseUrl;
  postId: number | undefined = 1;
  token: string = "";
  public messageChangeEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  postHeader = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  public getAllComments(id: number | undefined): Observable<any> {
    let param = "?postId=" + id;
    return this.httpClient
      .get<any>(
        this.baseURL +
          "posts/" +
          id +
          "/comments" +
          param +
          "&pageNumber=0&pageSize=100"
      )
      .pipe(map((response) => response));
  }

  public postComment(comment: PostComment): Observable<any> {
    let temp: any = this.userService.getTokenFromLocalStorage();
    this.token = temp.access_token;
    let postHeader = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    };
    return this.httpClient
      .post<any>(
        this.baseURL + "posts/" + this.postId + "/comments",
        comment,
        postHeader
      )
      .pipe(map((response) => response));
  }

  public getPosts(pageNum: number): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + "posts", {
      params: {
        pageSize: 5,
        pageNumber: pageNum,
      },
    });
  }

  public getPostByDesc(description: string): Observable<any> {
    let token = this.userService.getTokenFromLocalStorage();

    const options = {
      params: {
        pageNumber: 0,
        pageSize: 100,
        filter: description,
      },
      headers: {
        Authorization: `Bearer ${Object(token).access_token}`,
      },
    };

    const nonTokenOptions = {
      params: {
        pageNumber: 0,
        pageSize: 100,
        filter: description,
      },
    };
    if (token) {
      return this.httpClient.get<any>(environment.baseUrl + "posts", options);
    } else {
      return this.httpClient.get<any>(environment.baseUrl + "posts", nonTokenOptions);
    }
  }

  public getPostByUser(username: string): Observable<any> {
    let token = this.userService.getTokenFromLocalStorage();
    const options = {
      params: {
        pageNumber: 0,
        pageSize: 100,
      },
      headers: {
        Authorization: `Bearer ${Object(token).access_token}`,
      },
    };

    const nonTokenOptions = {
      params: {
        pageNumber: 0,
        pageSize: 100,
      },
    };

    if (token) {
      return this.httpClient.get<any>(environment.baseUrl + `posts/${username}`, options);
    } else {
      return this.httpClient.get<any>(environment.baseUrl + `posts/${username}`, nonTokenOptions);
    }
  }

  public getAllPosts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + "posts", {
      params: {
        pageSize: 100,
        pageNumber: 0,
      },
    });
  }

  public updatePostDescription(id: number, message: string, token: string): Observable<any> {
    let data: FormData = new FormData();
    data.set("message", message);
    data.set("file", new Blob());
    return this.httpClient.put<any>(environment.baseUrl + "posts/" + id, data, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  public emitMessageChange(data: { id: number; message: string }) {
    this.messageChangeEvent.next(data);
  }

  public getPostsWithHasLiked(pageNum: number) {
    let token = this.userService.getTokenFromLocalStorage();
    let username;
    if (token) {
      username = Object(token).username;
      console.log(`${environment.baseUrl}${username}`);
    }
    console.log(token);
    const options = {
      params: {
        pageNumber: pageNum,
        pageSize: 5,
      },
      headers: {
        Authorization: `Bearer ${Object(token).access_token}`,
      },
    };
    return this.httpClient.get<any>(environment.baseUrl + "posts", options);
  }

  addLikeToPost(postId: number) {
    let token = this.userService.getTokenFromLocalStorage();
    const headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${Object(token).access_token}`,
      }),
    };
    return this.httpClient.post(
      environment.baseUrl + "posts/" + postId + "/likes",
      {},
      headers
    );
  }

  deleteLikeToPost(postId: number) {
    let token = this.userService.getTokenFromLocalStorage();
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${Object(token).access_token}`,
      }),
    };
    return this.httpClient.delete(
      environment.baseUrl + "posts/" + postId + "/likes",
      headers
    );
  }
  upload(file: File, token: string, message: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.set("message", message);
    formData.set("file", file);
    return this.httpClient.post<any>(environment.baseUrl + "posts", formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  public getPostsByUsername(
    pageNum: number,
    username: string
  ): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + "posts/" + username, {
      params: {
        pageSize: 1000,
        pageNumber: pageNum,
      },
    });
  }

  public getPostsWithHasLikedProfile(pageNum: number, profileUsername?: string) {
    let token = this.userService.getTokenFromLocalStorage();
    let username;
    if (token) {
      username = Object(token).username;
      console.log(`${environment.baseUrl}${username}`);
    }
    console.log(token);
    const options = {
      params: {
        pageNumber: pageNum,
        pageSize: 10000,
      },
      headers: {
        Authorization: `Bearer ${Object(token).access_token}`,
      },
    };
    return this.httpClient.get<any>(environment.baseUrl + "posts/" + profileUsername, options);
  }
}
