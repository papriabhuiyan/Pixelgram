import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";
import { environment } from "src/environments/environment";
import { User } from 'src/app/model/User';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  constructor(private userService: UserService, private router: Router) {}

  isAuthBoolean: boolean = false;
  onHome: boolean = false;
  menuToggle: boolean = false;
  userInput: string = "";
  selected = "Username";
  icon = "wb-sunny";
  @ViewChild("toggle") toggle!: ElementRef;
  @Output()
  searchEvent = new EventEmitter<any>();

  search() {
    const searchObj = { input: this.userInput, filter: this.selected };
    this.searchEvent.emit(searchObj);
  }

  ngOnInit(): void {
    if (this.userService.getTokenFromLocalStorage() != null) {
      this.isAuthBoolean = true;
    }
    if (this.router.url == "/") {
      this.onHome = true;
    }
  }

  ngAfterViewInit(): void {
    this.checkToggle();
  }

  @HostListener("window:resize")
  onLoad() {
    let resizeTimer;
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 400);
  }

  checkToggle() {
    const toggleValue = localStorage.getItem("toggle");
    if (toggleValue) this.toggle.nativeElement.checked = true;
    else this.toggle.nativeElement.checked = false;
    console.log(this.toggle.nativeElement.checked);
  }

  darkMode() {
    const value = localStorage.getItem("theme");
    const toggleValue = localStorage.getItem("toggle");
    if (value && toggleValue) {
      localStorage.removeItem("theme");
      localStorage.removeItem("toggle");
      this.toggle.nativeElement.checked = false;
    } else {
      localStorage.setItem("theme", "dark-theme");
      localStorage.setItem("toggle", "true");
      this.toggle.nativeElement.checked = true;
    }
    const dark = document.body.classList.toggle("dark-theme");
  }

  reRoute() {
    if (this.userService.getTokenFromLocalStorage() != null) {
      this.isAuthBoolean = true;
      this.userService.logout(localStorage.getItem(environment.userToken));
      this.router.navigate(["/"]);
      if (this.onHome) this.pageReload();
    } else {
      this.router.navigate(["/login"]);
    }
  }

  pageReload() {
    window.location.reload();
  }
  onProfileClick() {
    let currentUser = this.userService.getTokenFromLocalStorage() as User
    if(!currentUser) {
      return
    }
    this.router.navigate(['user', currentUser.username])
  }
}
 