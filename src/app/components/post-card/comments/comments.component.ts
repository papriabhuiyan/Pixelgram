import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { PostService } from "../../../services/post/post.service";
import { PostComment } from "../../../model/Comment";
import { Post } from "src/app/model/Post";
import { MatDialog } from "@angular/material/dialog";
import { AddCommentModalComponent } from "../add-comment-modal/add-comment-modal.component";
import { User } from "src/app/model/User";
import { ViewCommentModalComponent } from "../view-comment-modal/view-comment-modal.component";
import { SelectMultipleControlValueAccessor } from "@angular/forms";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit {
  comments: PostComment[] = [];
  viewBool = false;
  contentSection: any;
  currentId: number = 0;
  message: string = "";
  hasElements: boolean = false;
  timestamp: string = "some time";
  firstComment: PostComment = new PostComment("2022-11-10T17:01:13.739Z", 0, 0, new User(0, "", "", "", "", 0, 0, ""), "");
  messageLimit: number = 50;

  @Input()
  post: Post = new Post();

  @Input()
  user: User = new User();

  constructor(
    private postService: PostService,
    public dialog: MatDialog,
    public userService: UserService,
    private elementRef: ElementRef,
    public router: Router
  ) {}

  setPostId() {
    this.postService.postId = this.post?.id;
  }

  postComment() {
    if (this.comments.length > 1) {
      this.viewBool = true;
    }
    this.postService.postComment(this.comments[this.comments.length - 1]).subscribe((response) => {
      const event: CustomEvent = new CustomEvent("addComment", {
        bubbles: true,
        detail: response,
      });
      this.elementRef.nativeElement.dispatchEvent(event);
      console.log(response);
    });
  }

  createTimestamp() {
    let commentDate = new Date(this.post.createdOn);
    let currentDate = new Date();
    let dateDifference = (currentDate.getTime() - commentDate.getTime()) / 1000;
    if (dateDifference >= 217728000) {
      let year = Math.round(217728000);
      this.timestamp = year + "y";
    } else if (dateDifference >= 18144000) {
      let month = Math.round(dateDifference / 18144000);
      this.timestamp = month + "mo";
    } else if (dateDifference >= 604800) {
      let week = Math.round(dateDifference / 604800);
      this.timestamp = week + "w";
    } else if (dateDifference >= 86400) {
      let day = Math.round(dateDifference / 86400);
      this.timestamp = day + "d";
    } else if (dateDifference >= 3600) {
      let hour = Math.round(dateDifference / 3600);
      this.timestamp = hour + "h";
    } else if (dateDifference >= 60) {
      let minute = Math.round(dateDifference / 60);
      this.timestamp = minute + "m";
    } else {
      this.timestamp = Math.round(dateDifference) + "s";
    }
  }

  openDialog() {
    this.setPostId();
    this.currentId = this.contentSection["size"];
    let dialogRef = this.dialog.open(AddCommentModalComponent, {
      height: "32rem",
      width: "30rem",
      hasBackdrop: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (this.comments.length == 0) {
          this.firstComment.author = this.user!;
          this.firstComment.message = result;
          this.hasElements = true;
        }
        this.message = result as string;
        let date = new Date();
        let dateString: string =
          date.getFullYear() +
          "-" +
          date.getMonth() +
          "-" +
          date.getDay() +
          "T" +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds() +
          ".739Z";
        console.log(date.getTime().toString());
        this.comments.push(new PostComment(date.getTime().toString(), this.currentId, this.post?.id, this.user!, result));
        this.currentId = this.currentId + 1;
        this.postComment();
      }
    });
  }

  openCommentDialog() {
    this.postService.postId = this.post?.id;
    let dialogRef = this.dialog.open(ViewCommentModalComponent, {
      width: "40em",
      height: "40em",
      hasBackdrop: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  getAllComments(id: number | undefined) {
    this.postService.getAllComments(id).subscribe((response: any) => {
      this.contentSection = response;
      if (this.contentSection["content"] != undefined) {
        this.contentSection["content"].forEach((comment: PostComment) => {
          this.comments.push(comment);
        });
      }
      this.comments = this.comments.reverse();
      if (this.comments.length > 0) {
        this.hasElements = true;
        this.firstComment.author.username = this.comments[0].author.username;
        this.firstComment.message = this.comments[0].message;
        this.firstComment.createdOn = this.comments[0].createdOn;
      }
      if (this.comments.length > 1) this.viewBool = true;
    });
  }

  showMoreMessage() {
    this.openCommentDialog();
  }

  ngOnInit(): void {
    this.getAllComments(this.post?.id);
    this.createTimestamp();
  }

  onProfileClick(username: string) {
    this.router.navigate(["user", username]);
  }
}
