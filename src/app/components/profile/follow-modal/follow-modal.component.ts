import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-modal',
  templateUrl: './follow-modal.component.html',
  styleUrls: ['./follow-modal.component.css']
})
export class FollowModalComponent implements OnInit {

  constructor(private router: Router, public dialogRef: MatDialogRef<FollowModalComponent>, @Inject(MAT_DIALOG_DATA) public following: any, @Inject(MAT_DIALOG_DATA) public follower:any, @Inject(MAT_DIALOG_DATA) public followLength:any) { }

  ngOnInit(): void {
    this.following = this.following.following;
    this.follower = this.follower.follower;
  }
  
  closeDialog() {
    this.dialogRef.close({ action: "Success" });
  }

  profile(username: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['user', username])
    this.closeDialog();
  }
}
