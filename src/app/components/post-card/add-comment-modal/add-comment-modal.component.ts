import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PostComment } from "src/app/model/Comment";
import { User } from "src/app/model/User";
import { PostService } from "src/app/services/post/post.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-add-comment-modal",
  templateUrl: "./add-comment-modal.component.html",
  styleUrls: ["./add-comment-modal.component.css"],
})
export class AddCommentModalComponent implements OnInit {
  message: string = "";
  isTouched: boolean = false;

  closeDialog() {
    if (this.message !== "") {
      this.dialogRef.close(this.message);
    }
  }

  exit() {
    this.dialogRef.close(null);
  }

  constructor(
    private postService: PostService,
    public dialogRef: MatDialogRef<AddCommentModalComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
}
