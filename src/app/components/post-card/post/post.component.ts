import { Component, HostListener, Input, OnInit } from "@angular/core";
import { heartBeatOnEnterAnimation } from "angular-animations";
import { Post } from "src/app/model/Post";
import { PostService } from "src/app/services/post/post.service";
import { User } from "src/app/model/User";
import { UserService } from "src/app/services/user/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
  animations: [heartBeatOnEnterAnimation()],
})
export class PostComponent implements OnInit {
  @Input() post: Post = new Post();
  @Input() user: User = new User(0, "", "", "", "", 0, 0, "");
  liked: boolean = false;
  zoom: boolean = false;
  messageThreshold: number = 125; // Length at which to truncate post message.
  messageTruncated: boolean = false;
  pluralMappings: any = {
    // For i18nPlural pipe. Comes bundled with angular.
    like: {
      "=1": "Like",
      other: "Likes",
    },
    comment: {
      "=1": "Comment",
      other: "Comments",
    },
  };

  constructor(private postService: PostService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.postService.messageChangeEvent.subscribe({
      next: (res) => {
        if (res && res.id === this.post.id) {
          if (res.message.length > this.messageThreshold) {
            this.messageTruncated = true;
          } else {
            this.messageTruncated = false;
          }
        }
      },
    });

    if (this.post.message.length > this.messageThreshold) {
      this.messageTruncated = true;
    }
    if (this.post.hasLiked) {
      this.liked = true;
    }
  }
  expandMessage() {
    this.messageTruncated = !this.messageTruncated;
  }

  postLikeAction() {
    if (this.userService.getTokenFromLocalStorage()) {
      this.liked = !this.liked;
      if (this.liked == true) {
        this.postService.addLikeToPost(this.post.id).subscribe();
        this.post.numLikes++;
      } else {
        this.postService.deleteLikeToPost(this.post.id).subscribe();
        this.post.numLikes--;
      }
    }
  }

  toggleZoom() {
    this.zoom = !this.zoom;
  }

  onPostDoubleClick() {
    this.postLikeAction();
  }
  @HostListener("addComment", ["$event"])
  onCustomEventCaptured(event: any) {
    this.post.numComments++;
  }
  onProfileClick(username: string) {
    this.router.navigate(["user", username]);
  }
}
