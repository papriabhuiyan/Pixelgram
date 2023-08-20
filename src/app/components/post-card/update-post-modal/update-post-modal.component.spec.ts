import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { PostUpload } from "src/app/model/PostUpload";
import { MatIconModule } from "@angular/material/icon";

import { UpdatePostModalComponent } from "./update-post-modal.component";

describe("UpdatePostModalComponent", () => {
  let component: UpdatePostModalComponent;
  let fixture: ComponentFixture<UpdatePostModalComponent>;

  let MockDialogRef = {
    close: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePostModalComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: MockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { postUpload: new PostUpload() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("closeDialog should close modal", () => {
    spyOn(component.dialogRef, "close");
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it("submit should close modal and pass 'Submit' as action", () => {
    spyOn(component.dialogRef, "close");
    component.postUpload.message = "hey how is it going.";
    component.onSubmit();
    expect(component.dialogRef.close).toHaveBeenCalledWith({
      action: "Submit",
      message: component.postUpload.message,
    });
  });
});
