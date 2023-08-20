import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { ChooseImageModalComponent } from "./choose-image-modal.component";
const dialogMock = {
  close: () => {},
};
describe("ChooseImageModalComponent", () => {
  let component: ChooseImageModalComponent;
  let fixture: ComponentFixture<ChooseImageModalComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<ChooseImageModalComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseImageModalComponent],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("onCancel should close the component", () => {
    spyOn(component, "onCancel").and.callThrough();
    spyOn(component.dialogRef, "close");
    spyOn(component, "vidOff");

    component.onCancel();

    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(component.vidOff).toHaveBeenCalled();
  });

  it("should check if vidOff is called when onCancel is working", () => {
    spyOn(component, "vidOff");
    component.onCancel();
    expect(component.vidOff).toHaveBeenCalled();
  });

  it("isCaptured should be false when removeCurrent is called", () => {
    component.removeCurrent();
    expect(component.isCaptured).toBeFalsy;
  });

  it("onSubmit should check there is a preview", () => {
    spyOn(component, "onSubmit").and.callThrough();
    spyOn(component.dialogRef, "close");
    spyOn(component, "vidOff");

    component.photoPreview = "string";

    component.onSubmit();

    expect(component.dialogRef.close).toHaveBeenCalledWith({ file: component.currentFile, preview: "string" });
    expect(component.vidOff).toHaveBeenCalled();
  });
  it("vidOff() should get srcObject", () => {
    component.video.nativeElement.srcObject = new MediaStream([]);
    spyOn(component, "vidOff").and.callThrough();
    spyOn(component.video.nativeElement.srcObject, "getTracks").and.returnValue([
      {
        something: "hi",
        stop() {
          return true;
        },
      },
      {
        something: "hi",
        stop() {
          return true;
        },
      },
    ]);

    component.vidOff();

    expect(component.video.nativeElement.srcObject).toBeNull();
  });
  it("capture() should call convertBase64toFile", () => {
    spyOn(component, "capture").and.callThrough();
    spyOn(component, "drawImageToCanvas");
    spyOn(component, "convertBase64toFile");
    component.isCaptured = false;
    component.preview = "string";

    component.capture();

    expect(component.isCaptured).toBeTrue();
    expect(component.preview).toBe("");
    expect(component.convertBase64toFile).toHaveBeenCalled();
    expect(component.drawImageToCanvas).toHaveBeenCalled();
  });
  it("convertFile() should call FileReader readAsDataURL()", () => {
    spyOn(component, "convertFile").and.callThrough();
    spyOn(FileReader.prototype, "readAsDataURL").and.callFake(() => {
      return true;
    });

    component.convertFile(new File([new Blob()], "file"));

    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(new File([new Blob()], "file"));
  });
});
