import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogTitle, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Follower } from "src/app/model/Follower";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/model/User";
import { UserService } from "src/app/services/user/user.service";
import { FollowModalComponent } from "../follow-modal/follow-modal.component";
import { Post } from "src/app/model/Post";
import { PostService } from "src/app/services/post/post.service";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: User = new User(); // profile page user
  signedInUser: User = new User(); // signed in user or null(if user not signed in)
  posts: Post[] = [];
  currentPageNumber: number = 0;
  following: boolean = false;
  hideButton: boolean = false;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    let currentlyLoggedInUser = this.userService.getTokenFromLocalStorage();
    this.route.params.subscribe((params) => {
      this.userService.getUser(params["username"]).subscribe((res) => {
        this.user = res.content[0];
        if (this.userService.getTokenFromLocalStorage()) {
          this.fetchPostsByUsername();
        } else {
          this.fetchPosts();
        }
        this.fetchSignedInUser();
        if (
          Object(currentlyLoggedInUser)["username"] == this.user.username ||
          this.userService.getTokenFromLocalStorage() == null
        ) {
          this.hideButton = true;
        }
        this.userService.getFollowers(this.user.username).subscribe((res) => {
          if (res.filter((f: Follower) => f.username === Object(currentlyLoggedInUser)["username"]).length > 0) {
            this.following = true;
          }
        });
        this.loading = false;
      });
    });

    this.postService.messageChangeEvent.subscribe({
      next: (res) => {
        if (res) {
          let i = this.posts
            .map(function (x) {
              return x.id;
            })
            .indexOf(res.id);
          this.posts[i].message = res.message;
        }
      },
    });
  }

  getFollowers() {
    let followers: Follower[] = [];
    this.userService.getFollowers(this.user.username).subscribe((res) => {
      followers = res;
      let dialogRef = this.dialog.open(FollowModalComponent, {
        width: "30em",
        height: "40em",
        hasBackdrop: true,
        backdropClass: "backdrop",
        panelClass: "modal-style",
        data: {
          follower: followers,
          following: false,
          followLength: followers.length > 0,
        },
      });
      dialogRef.afterClosed().subscribe();
    });
  }

  getFollowing() {
    let followers: Follower[] = [];
    this.userService.getFollowings(this.user.username).subscribe((res) => {
      followers = res;
      let dialogRef = this.dialog.open(FollowModalComponent, {
        width: "30em",
        height: "40em",
        hasBackdrop: true,
        backdropClass: "backdrop",
        panelClass: "modal-style",
        data: {
          follower: followers,
          following: true,
          followLength: followers.length > 0,
        },
      });
      dialogRef.afterClosed().subscribe();
    });
  }

  follow() {
    this.userService.follow(this.user.username).subscribe();
    this.following = true;
    this.user.followerCount++;
  }

  unfollow() {
    this.userService.unfollow(this.user.username).subscribe();
    this.following = false;
    this.user.followerCount--;
  }
  fetchPosts() {
    this.posts = [];
    this.postService.getPostsByUsername(this.currentPageNumber, this.user.username).subscribe({
      next: (response) => {
        if (response !== undefined) {
          console.log(response);
          response.content.map((post: any) => {
            this.posts.push(
              new Post(
                post.id,
                post.createdOn,
                post.author.username,
                post.author.profileImageUrl,
                post.message,
                post.imageUrl,
                post.likeCount,
                post.comments.content.length,
                post.hasLiked
              )
            );
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fetchPostsByUsername() {
    this.posts = [];
    this.postService.getPostsWithHasLikedProfile(this.currentPageNumber, this.user.username).subscribe({
      next: (response) => {
        if (response !== undefined) {
          response.content.map((post: any) => {
            this.posts.push(
              new Post(
                post.id,
                post.createdOn,
                post.author.username,
                post.author.profileImageUrl,
                post.message,
                post.imageUrl,
                post.likeCount,
                post.comments.content.length,
                post.hasLiked
              )
            );
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fetchSignedInUser() {
    let tokenObj: any = this.userService.getTokenFromLocalStorage();
    if (!tokenObj) {
      return;
    }
    let username: string = tokenObj.username;
    this.userService.getUser(username).subscribe((response) => {
      if (response != undefined) {
        this.signedInUser = response["content"][0];
        this.signedInUser.accessToken = tokenObj.access_token;
      }
    });
  }

  onEditProfile() {
    let dialogRef = this.dialog.open(EditProfileComponent, {
      height: "36rem",
      width: "35rem",
      hasBackdrop: true,
      disableClose: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
      data: {
        user: this.user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.message == "Submit") {
        this.userService.editUserInfo(this.user.name, this.user.bio).subscribe((res) => {});
        if (result.file) {
          this.snackBar.open("Updating your profile picture", "Ok", {
            panelClass: ["confirm-snackbar"],
            verticalPosition: "bottom",
            horizontalPosition: "start",
          });
          this.userService.editUserPicture(result.file).subscribe((res) => {
            this.reload(); // Quick and easy fix maybe not the best though. oh well.
          });
        }
      } else if (result.message == "Delete") {
        this.userService.deleteUserPicture().subscribe((res) => {
          this.reload();
        });
        this.snackBar.open("Profile Picture Deleted", "Ok", {
          duration: 4000,
          panelClass: ["delete-snackbar"],
          verticalPosition: "bottom",
          horizontalPosition: "start",
        });
      } else if (result.message == "Success") {
        this.reload();
      }
    });
  }

  @HostListener("deletePost", ["$event"])
  onCustomEventCaptured(event: any) {
    const tempList = this.posts.filter((post) => post.id != event.detail.id);
    this.posts = tempList;
  }

  shouldDisplayMenu(): boolean {
    if (this.user.username === "DEFAULT") {
      return false;
    }
    if (this.user.username === Object(this.userService.getTokenFromLocalStorage()).username) {
      return true;
    } else {
      return false;
    }
  }

  reload() {
    location.reload();
  }
}
