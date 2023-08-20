import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { DeletePostService } from "../../../services/post/deletePost.service";
import { DeletePostModalComponent } from "./delete-post-modal.component";

describe("DeletePostModalComponent", () => {
  let component: DeletePostModalComponent;
  let fixture: ComponentFixture<DeletePostModalComponent>;
  let deletePostServiceSpy: jasmine.SpyObj<DeletePostService>;
  const dialogMock = {
    close: () => {},
  };

  beforeEach(async () => {
    deletePostServiceSpy = jasmine.createSpyObj("DeletePostService", ["deletePost"]);
    await TestBed.configureTestingModule({
      declarations: [DeletePostModalComponent],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        MatDialog,
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DeletePostService, useValue: deletePostServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should test onDelete method", () => {
    deletePostServiceSpy.deletePost.and.returnValue(of(true));
    component.onDelete();
    fixture.whenStable();
    expect(deletePostServiceSpy.deletePost).toHaveBeenCalled();
  });

  it("should close delete dialog", () => {
    let close = spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(close).toHaveBeenCalled();
  });

  it("should test error onDelete method", () => {
    deletePostServiceSpy.deletePost.and.returnValue(of(new Error()));
    let close = spyOn(component.dialogRef, "close").and.callThrough();
    component.closeDialog();
    expect(close).toHaveBeenCalled();
  });
});
