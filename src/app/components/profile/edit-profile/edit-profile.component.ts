import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  isCameraActive: boolean = false // Set this to true when user is taking a picture for their profile
  selectedFile: File | undefined
  
  @ViewChild("video")
  public video!: ElementRef;
  @ViewChild("canvas")
  public canvas!: ElementRef;

  error: any = null

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public user: any) {
  }

  ngOnInit(): void {
    this.user = this.user.user // ???? ¿¿¿¿¿¿ ????
  }

  onTakePicture() {
    this.capture()
    this.cameraOff()
    this.isCameraActive = false
  }
  onCancelCamera() {
    this.cameraOff()
    this.isCameraActive = false
  }
  onFileSelected(event: any) {
    const fileReader = new FileReader()
    this.selectedFile = event.target.files[0]
    
    fileReader.onload = (e: any) => {
      this.user.profileImageUrl = e.target.result
    };
    if(this.selectedFile) {
      fileReader.readAsDataURL(this.selectedFile)
    }
  }
  onEnableCamera() {
    this.setupDevices()
    this.isCameraActive = true
  }
  onDeletePicture() {
    this.user.profileImageUrl = "/assets/grey_profile_img.jpg"
    this.dialogRef.close({message: 'Delete'})
  }

  onSubmit() {
    this.dialogRef.close({message: 'Submit', file: this.selectedFile})
  }

  closeDialog() {
    this.dialogRef.close({message: 'Success', file: undefined})
  }

  /* CAMERA CONTROLS */
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 4096 },
            height: { ideal: 2160 }}
        });

        if(stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }  
  }
  cameraOff(){
    const stream = this.video.nativeElement.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track : any) => {
      track.stop();
    });
    this.video.nativeElement.srcObject = null;
  }
  async convertBase64toFile(imageurl :  any){
    fetch(imageurl)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], "photo.png",{ type: "image/png" })
      const myfile = this.convertFile(file)
      this.selectedFile = file
    })
  }
  convertFile(file : File){
    const reader = new FileReader()
    reader.onload = (e: any) => {
      this.user.profileImageUrl = e.target.result;
    }
    reader.readAsDataURL(file)
  }
  drawImageFromCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, -50, -50, 400, 200)
  }
  capture(){
    this.drawImageFromCanvas(this.video.nativeElement);
    const imageurl = this.canvas.nativeElement.toDataURL("image/png")
    this.convertBase64toFile(imageurl)
  }
}
