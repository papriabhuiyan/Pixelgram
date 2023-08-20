import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { LandingComponent } from "./components/landing/landing.component";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [{ provide: HttpClient }],
      declarations: [AppComponent, LandingComponent],
    }).compileComponents();

    var store: any = {};
    spyOn(localStorage, "getItem").and.callFake((key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, "removeItem").and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, "setItem").and.callFake((key: string, value: string): string => {
      return (store[key] = <string>value);
    });
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should test ngOnInit", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    localStorage.setItem("theme", "dark-theme");
    app.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalled();
  });
});
