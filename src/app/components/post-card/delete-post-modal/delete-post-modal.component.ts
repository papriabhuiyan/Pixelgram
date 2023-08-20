import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DeletePostService } from "src/app/services/post/deletePost.service";

@Component({
  selector: "app-delete-post-modal",
  templateUrl: "./delete-post-modal.component.html",
  styleUrls: ["./delete-post-modal.component.css"],
})
export class DeletePostModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeletePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deletePost: DeletePostService
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ action: "Success" });
  }
  onDelete() {
    this.deletePost.deletePost(this.data).subscribe({
      next: () => this.dialogRef.close(this.data),
      error: () => {
        this.dialogRef.close(false);
      },
    });
  }
}
