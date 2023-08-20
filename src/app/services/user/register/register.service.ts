import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { Register } from "src/app/model/Register";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(private httpClient: HttpClient) {}

  postHeader = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  public registerUser(reg: Register): Observable<any> {
    return this.httpClient.post<Register>(environment.baseUrl + "oauth/register", reg, this.postHeader);
  }
}
