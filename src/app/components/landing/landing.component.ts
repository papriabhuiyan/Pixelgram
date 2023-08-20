import { Component, HostListener, OnInit } from "@angular/core";
import { Post } from "src/app/model/Post";
import { User } from "src/app/model/User";
import { PostService } from "src/app/services/post/post.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements OnInit {
  posts: Post[] = [];
  user: User = new User();
  currentPageNumber: number = 0;
  originalPosts: Post[] = [];
  allPosts: Post[] = [];
  isInit: boolean = false;
  userInput: string = "";
  isSearched: boolean = false;

  constructor(private postService: PostService, private userService: UserService) {}

  ngOnInit(): void {
    if (this.userService.getTokenFromLocalStorage()) {
      this.fetchPostsByUsername();
    } else {
      this.fetchPosts();
    }
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
    this.fetchUser();
  }

  searchPost(event: any) {
    this.isSearched = true;
    const input = event.input;
    this.userInput = input;
    const filter = event.filter;
    if (input.length == 0) this.searchIsEmpty();
    else if (filter == "Username") this.searchByUsername(input);
    else this.searchByDescription(input);
  }

  searchByDescription(description: string) {
    this.postService.getPostByDesc(description).subscribe({
      next: (res) => {
        if (res) {
          this.posts = [];
          res.content.map((post: any) => {
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
    });
  }

  searchByUsername(username: string) {
    this.postService.getPostByUser(username).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.posts = [];
          res.content.map((post: any) => {
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
    });
  }

  searchIsEmpty() {
    this.isSearched = false;
    this.posts = [];
    this.currentPageNumber = 0;
    if (this.userService.getTokenFromLocalStorage()) {
      this.fetchPostsByUsername();
    } else {
      this.fetchPosts();
    }
  }

  fetchPosts() {
    this.postService.getPosts(this.currentPageNumber).subscribe({
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
    this.postService.getPostsWithHasLiked(this.currentPageNumber).subscribe({
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

  fetchUser() {
    let tokenObj: any = this.userService.getTokenFromLocalStorage();
    if (!tokenObj) {
      return;
    }
    let username: string = tokenObj.username;
    this.userService.getUser(username).subscribe((response) => {
      if (response != undefined) {
        this.user = response["content"][0];
        this.user.accessToken = tokenObj.access_token;
      }
    });
  }

  onScroll() {
    if (!this.isSearched) {
      ++this.currentPageNumber;
      this.fetchPosts();
    }
  }

  @HostListener("deletePost", ["$event"])
  onCustomEventCaptured(event: any) {
    const tempList = this.posts.filter((post) => post.id != event.detail.id);
    this.posts = tempList;
  }
}
