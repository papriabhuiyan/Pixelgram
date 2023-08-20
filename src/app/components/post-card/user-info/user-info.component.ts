import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { Post } from "src/app/model/Post";
import { User } from "src/app/model/User";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import { UpdatePostModalComponent } from "../update-post-modal/update-post-modal.component";
import { PostUpload } from "src/app/model/PostUpload";
import { PostService } from "src/app/services/post/post.service";
import { DeletePostModalComponent } from "../delete-post-modal/delete-post-modal.component";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.css"],
})
export class UserInfoComponent implements OnInit {
  @Input() post: Post = new Post();
  @Input() user: User = new User();
  dialogRef: any;
  admin: boolean = this.userService.isAdmin();

  constructor(
    public dialog: MatDialog,
    public postService: PostService,
    private elementRef: ElementRef,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onDelete() {
    this.dialogRef = this.dialog.open(DeletePostModalComponent, {
      height: "25rem",
      width: "35rem",
      hasBackdrop: true,
      backdropClass: "backdrop",
      data: this.post,
      panelClass: "modal-style",
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const event: CustomEvent = new CustomEvent("deletePost", {
          bubbles: true,
          detail: result,
        });
        this.elementRef.nativeElement.dispatchEvent(event);
      }
    });
  }

  openSpecificDialog() {
    let dialogRef = this.dialog.open(UpdatePostModalComponent, {
      height: "25rem",
      width: "35rem",
      hasBackdrop: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
      data: {
        postUpload: new PostUpload(this.post.id, this.post.imageUrl, this.post.message),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action == "Submit") {
        this.postService.updatePostDescription(this.post.id, result.message, this.user.accessToken).subscribe({
          next: (res) => {
            console.log("Post Updated");
            this.postService.emitMessageChange({
              id: this.post.id,
              message: result.message,
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  shouldDisplayMenu(): boolean {
    if (this.user.username === "DEFAULT") {
      return false;
    }

    if (this.userService.isAdmin()) {
      return true;
    } else if (this.user.username === this.post.username) {
      return true;
    } else {
      return false;
    }
  }

  onProfileClick(username: string) {
    this.router.navigate(['user', username])
  }
}
