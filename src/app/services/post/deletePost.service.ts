import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { Post } from "../../model/Post";
import { environment } from "src/environments/environment.prod";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DeletePostService {
  constructor(private httpClient: HttpClient, private userService: UserService) {}

  public deletePost(post: Post): Observable<any> {
    let token: any = this.userService.getTokenFromLocalStorage();
    token = token.access_token;
    return this.httpClient.delete(environment.baseUrl + "posts/" + post.id, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
