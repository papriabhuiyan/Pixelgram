import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar/navbar.component";
import { LandingComponent } from "./components/landing/landing.component";
import { PostComponent } from "./components/post-card/post/post.component";
import { UserInfoComponent } from "./components/post-card/user-info/user-info.component";
import { CommentsComponent } from "./components/post-card/comments/comments.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";
import { AddCommentModalComponent } from "./components/post-card/add-comment-modal/add-comment-modal.component";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { UpdatePostModalComponent } from "./components/post-card/update-post-modal/update-post-modal.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ViewCommentModalComponent } from "./components/post-card/view-comment-modal/view-comment-modal.component";
import { UserService } from "./services/user/user.service";
import { CreatePostComponent } from "./components/publishImage/create-post/create-post.component";
import { RouterModule } from "@angular/router";
import { DeletePostModalComponent } from "./components/post-card/delete-post-modal/delete-post-modal.component";
import { ChooseImageModalComponent } from "./components/publishImage/choose-image-modal/choose-image-modal.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ProfileComponent } from "./components/profile/profile/profile.component";
import { FollowModalComponent } from "./components/profile/follow-modal/follow-modal.component";
import { EditProfileComponent } from "./components/profile/edit-profile/edit-profile.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    LandingComponent,
    PostComponent,
    UserInfoComponent,
    CommentsComponent,
    AddCommentModalComponent,
    UpdatePostModalComponent,
    ViewCommentModalComponent,
    CreatePostComponent,
    DeletePostModalComponent,
    ChooseImageModalComponent,
    ProfileComponent,
    FollowModalComponent,
    EditProfileComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatMenuModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
