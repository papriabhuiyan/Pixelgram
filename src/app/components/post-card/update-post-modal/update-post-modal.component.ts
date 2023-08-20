import { Component, OnInit, Inject, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PostUpload } from "src/app/model/PostUpload";

@Component({
  selector: "app-update-post-modal",
  templateUrl: "./update-post-modal.component.html",
  styleUrls: ["./update-post-modal.component.css"],
})
export class UpdatePostModalComponent implements OnInit {
  postUpload: PostUpload = new PostUpload();
  onInputChange: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdatePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postUpload = this.data.postUpload;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close({ action: "Success" });
  }
  onSubmit() {
    if (this.postUpload.message.length > 1) {
      this.dialogRef.close({
        action: "Submit",
        message: this.postUpload.message,
      });
    }
  }
}
