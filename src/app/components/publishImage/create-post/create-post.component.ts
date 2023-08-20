import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";
import { MatDialog } from "@angular/material/dialog";
// import { ChooseImageModalComponent } from '../choose-image-modal/choose-image-modal.component';
import { PostService } from "src/app/services/post/post.service";
import { Post } from "src/app/model/Post";
import { ChooseImageModalComponent } from "../choose-image-modal/choose-image-modal.component";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.css"],
})
export class CreatePostComponent implements OnInit {
  invalid: boolean = false;
  noImage: boolean = false;
  noDescription: boolean = false;
  isSubmitted: any = false;
  idk: any;
  selectedFiles?: FileList;
  currentFile!: File;
  progress = 0;
  message: string = "";
  preview: string = "";
  isSelected: boolean = false;
  desc: string = "cognizant";
  submitted: boolean = false;
  isSubmit: boolean = false;

  createPostForm = new FormGroup({
    uploadImage: new FormControl("", [Validators.required]),
    uploadDescription: new FormControl("", [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private postService: PostService,
    public router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
  get uploadImage() {
    return this.createPostForm.get("uploadImage");
  }

  get uploadDescription() {
    return this.createPostForm.get("uploadDescription");
  }

  createPost() {
    this.submitted = true;
    if (this.message.length) {
      this.isSubmit = true;
      let temp: any = this.userService.getTokenFromLocalStorage();
      let token = temp.access_token;
      console.log(this.currentFile);
      console.log(this.message + "lets try message");
      this.postService.upload(this.currentFile, token, this.message).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (error) => console.log(error),
      });
    }
  }
  openChooseImageDialog() {
    let dialogRef = this.dialog.open(ChooseImageModalComponent, {
      width: "600px",
      height: "430px",
      hasBackdrop: true,
      backdropClass: "backdrop",
      panelClass: "modal-style",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentFile = result.file;
        this.preview = result.preview;
        console.log(this.preview);
        // console.log(this.currentFile);
      }
    });
  }

  onCancel() {
    this.router.navigate(["/"]);
  }
}
