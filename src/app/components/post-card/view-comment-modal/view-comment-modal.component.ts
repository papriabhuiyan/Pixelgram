import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PostComment } from 'src/app/model/Comment';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-view-comment-modal',
  templateUrl: './view-comment-modal.component.html',
  styleUrls: ['./view-comment-modal.component.css']
})
export class ViewCommentModalComponent implements OnInit {

  contentSection: any;
  comments: PostComment[] = [];
  exitBool: boolean = false;
  messageLimit: number = 50;
  messageLimits: number[] = [];
  timestamps: string[] = [];
  commentDate: Date = new Date();
  currentDate: Date = new Date(); 

  closeDialog() {
    this.dialogRef.close("Success");
  }

  getAllComments(id: number | undefined){
    this.postService
    .getAllComments(id)
    .subscribe(
      (response: any) => {
        this.contentSection = response;
        console.log(this.contentSection);
        if(this.contentSection['content'] != undefined){
          this.contentSection['content'].forEach((comment: PostComment) => {
            this.comments.push(comment);
            this.messageLimits.push(125);
          });
        }
        this.comments = this.comments.reverse();
        if(this.comments.length > 0){
          this.exitBool = true;
        }
        this.createTimestamp();
      }
    )
  }

  showMoreMessage(index: number){
    this.messageLimits[index] = 255;
  }

  showLessMessage(index: number){
    this.messageLimits[index] = 125;
  }

  createTimestamp(){
    this.comments.forEach((comment: PostComment) => {
      this.commentDate = new Date(comment.createdOn);
      this.currentDate = new Date();
      let dateDifference = (this.currentDate.getTime()-this.commentDate.getTime())/1000;
      if(dateDifference >= 217728000){
        let year = Math.round(217728000)
        this.timestamps.push(year + "y");
      }else if(dateDifference >= 18144000){
        let month = Math.round(dateDifference/18144000)
        this.timestamps.push(month + "mo");
      }else if(dateDifference >= 604800){
        let week = Math.round(dateDifference/604800)
        this.timestamps.push(week + "w");
      }else if(dateDifference >= 86400){
        let day = Math.round(dateDifference/86400)
        this.timestamps.push(day + "d");
      }else if(dateDifference >= 3600){
        let hour = Math.round(dateDifference/3600)
        this.timestamps.push(hour + "h");
      }else if(dateDifference >= 60){
        let minute = Math.round(dateDifference/60)
        this.timestamps.push(minute + "m");
      }else{
        this.timestamps.push(Math.round(dateDifference) + "s");
    }
    })
  }
  
  constructor(
    public dialogRef: MatDialogRef<ViewCommentModalComponent>,
    public postService: PostService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getAllComments(this.postService.postId);
  }

  onProfileClick(username: string) {
    this.closeDialog()
    this.router.navigate(['user', username])
  }

}
