import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { LandingComponent } from "./components/landing/landing.component";
import { NavbarComponent } from "./components/navbar/navbar/navbar.component";
import { ProfileComponent } from "./components/profile/profile/profile.component";
import { CreatePostComponent } from "./components/publishImage/create-post/create-post.component";
import { UserService } from "./services/user/user.service";
import { FollowModalComponent } from "./components/profile/follow-modal/follow-modal.component";

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "register", component: RegisterComponent, canActivate: [UserService] },
  { path: "login", component: LoginComponent, canActivate: [UserService] },
  { path: "nav", component: NavbarComponent },
  { path: "createPost", component: CreatePostComponent, canActivate: [UserService] },
  { path: "followModal", component:FollowModalComponent },
  { path: "profile", component: ProfileComponent},
  { path: "user/:username", component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
