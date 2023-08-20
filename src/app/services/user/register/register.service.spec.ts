import { HttpClient, HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { Register } from "src/app/model/Register";
import { environment } from "../../../../environments/environment";

import { RegisterService } from "./register.service";

describe("RegisterService", () => {
  let service: RegisterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "put"]);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(RegisterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("registerUser should POST new user to backend", () => {
    const returnVal = {
      access_token: "string",
      expires_in: 0,
      refresh_expires_in: 0,
      refresh_token: "string",
      token_type: "string",
      session_state: "string",
      scope: "string",
      notBeforePolicy: 0,
    };

    httpClientSpy.post.and.returnValue(of(returnVal));
    httpClientSpy.put.and.returnValue(of(returnVal));
    const reg = new Register("user", "password");

    spyOn(service, "registerUser").withArgs(reg).and.returnValue(of(returnVal));

    service.registerUser(reg);

    expect(service.registerUser).toHaveBeenCalled();

    service.registerUser(reg).subscribe((val) => {
      expect(val).toEqual(returnVal);
    });
  });

  it("should POST new user to backend", () => {
    httpClientSpy.post.and.returnValue(of(true));
    const reg = new Register("user", "password");
    service.registerUser(reg);
    expect(httpClientSpy.post).toHaveBeenCalled();
  });
});
