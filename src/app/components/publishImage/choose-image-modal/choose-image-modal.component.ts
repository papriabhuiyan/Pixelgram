import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-choose-image-modal",
  templateUrl: "./choose-image-modal.component.html",
  styleUrls: ["./choose-image-modal.component.css"],
})
export class ChooseImageModalComponent implements OnInit {
  preview = "";
  isSelected: boolean = false;
  selectedFiles?: FileList;
  currentFile!: File;

  WIDTH = 235;
  HEIGHT = 130;
  photoPreview = "";

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;
  captures: string[] = [];
  error: any;
  isCaptured: boolean = false;

  constructor(public dialogRef: MatDialogRef<ChooseImageModalComponent>) {}

  ngOnInit(): void {}
  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video:
            //true
            {
              width: { ideal: 4096 },
              height: { ideal: 2160 },
            },
        });
        if (stream) {
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

  async convertBase64toFile(imageurl: any) {
    fetch(imageurl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "photo.png", { type: "image/png" });
        const myfile = this.convertFile(file);
        this.currentFile = myfile;
      });
  }
  convertFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
    return file;
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    const imageurl = this.canvas.nativeElement.toDataURL("image/png");
    // possibly take out data:image/png;base64, of imageurl;
    console.log(imageurl);
    this.convertBase64toFile(imageurl);
    // this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
    this.preview = "";
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement.getContext("2d").drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  selectFile(event: any): void {
    this.photoPreview = "";
    // console.log(this.isCaptured);
    this.preview = "";
    this.selectedFiles = event.target.files;
    this.isSelected = true;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.isCaptured = false;
        console.log(this.isCaptured);
        this.preview = "";
        this.currentFile = file;
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          console.log(e.target.result);
          // this.currentFile= e.target.result;
          this.preview = e.target.result;
        };
        fileReader.readAsDataURL(this.currentFile);
      }
    }
  }
  onCancel() {
    this.dialogRef.close(false);
    this.vidOff();
  }
  onSubmit() {
    let obj = {
      file: this.currentFile,
      preview: this.preview,
    };
    if (this.photoPreview.length != 0) {
      obj.preview = this.photoPreview;
    }
    this.dialogRef.close(obj);
    this.vidOff();
  }
  vidOff() {
    const stream = this.video.nativeElement.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track: any) => {
      track.stop();
    });
    this.video.nativeElement.srcObject = null;
  }
}
