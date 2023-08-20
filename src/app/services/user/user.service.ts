import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, map, Observable, of, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import jwt_decode from "jwt-decode";
import { LoginComponent } from "src/app/components/auth/login/login.component";
import { RegisterComponent } from "src/app/components/auth/register/register.component";
import { User } from "src/app/model/User";
import { Follower } from "../../model/Follower"

@Injectable({
  providedIn: "root",
})
export class UserService implements CanActivate {
  postHeader = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  reload: boolean = false;
  baseUrl: string = environment.baseUrl;
  userToken: string = environment.userToken;

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentComponent = route.component;
    const token = this.getTokenFromLocalStorage();
    if (currentComponent == LoginComponent || currentComponent == RegisterComponent ) return this.gaurdAuthRoutes(token);
    else return this.gaurdNonAuthRoutes(token);
  }
  gaurdAuthRoutes(token : any): boolean{
    if (token) {
      this.router.navigate(["/"]);
      return false;
    } else {
      return true;
    }
  }
  gaurdNonAuthRoutes(token : any) : boolean{
    if (token)return true;
    else {
      this.router.navigate(["/"]);
      return false;
    }
  }

  login(username: string | null | undefined, password: string | null | undefined) {
    const body = {
      username: username,
      password: password,
    };
    return this.http.post(this.baseUrl + "oauth/token", body, this.postHeader);
  }

  logout(refresh_token: string | null) {
    const body = {
      refresh_token: Object(environment.userToken)["refresh_token"],
    };
    localStorage.removeItem(environment.userToken);
    return this.http.post(this.baseUrl + "oauth/logout", body, this.postHeader).subscribe();
  }

  getTokenFromLocalStorage(): Object | null {
    const returnVal = localStorage.getItem(environment.userToken);
    if (returnVal) return JSON.parse(returnVal);
    else return null;
  }

  getUser(username: string): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "users" + "?filter=" + username + "&pageNumber=0&pageSize=100")
      .pipe(map((response) => response));
  }

  editUserInfo(name: string, bio: string): Observable<any> {
    let body = { name: name, bio: bio}
    return this.http.patch(this.baseUrl + "users/profile", body, {
      headers: {
        Authorization: `Bearer ${Object(this.getTokenFromLocalStorage())["access_token"]}`,
      }
    })
  }
  editUserPicture(file: string): Observable<any> {
    const formData : FormData = new FormData();
    formData.set('image', file)
    return this.http.patch(this.baseUrl + "users/pic", formData, {
      headers: {
        Authorization: `Bearer ${Object(this.getTokenFromLocalStorage())["access_token"]}`,
      }
    })
  }
  deleteUserPicture(): Observable<any> {
    return this.http.delete(this.baseUrl + 'users/pic', {
      headers: {
        Authorization: `Bearer ${Object(this.getTokenFromLocalStorage())["access_token"]}`,
      }
    })
  }

  isAdmin(): boolean {
    var token = Object(this.getTokenFromLocalStorage())["access_token"];
    if (token) {
      var decoded: any = jwt_decode(token);
      var role = decoded.realm_access.roles.includes("admin");
      if (role) return true;
      return false;
    }
    return false;
  }

  follow(username: string) {
    let token = this.getTokenFromLocalStorage();
    let postHeader = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${Object(token).access_token}`,
      }),
    };
    return this.http.post(this.baseUrl+"users/"+username+"/follow", {}, postHeader).pipe();
  }

  unfollow(username: string) {
    let token = this.getTokenFromLocalStorage();
    let postHeader = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${Object(token).access_token}`,
      }),
    };
    return this.http.delete(this.baseUrl+"users/"+username+"/unfollow", postHeader).pipe();
  }

  getFollowers(username: string) {
    return this.http
      .get<any>(this.baseUrl+"users/"+username+"/followers")
      .pipe();
  }

  getFollowings(username: string) {
    return this.http
      .get<any>(this.baseUrl+"users/"+username+"/followings")
      .pipe();
  }
}
