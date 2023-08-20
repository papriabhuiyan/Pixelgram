import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/model/User';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let MockDialogRef = {
    close: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileComponent ],
      imports: [ MatDialogModule ],
      providers: [
        { provide: MatDialogRef, useValue: MockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { user: new User() } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onTakePicture should call capture() and cameraOff() functions, as well as set isCameraActive to false', () => {
    spyOn(component, 'onTakePicture').and.callThrough()
    spyOn(component, 'capture')
    spyOn(component, 'cameraOff')
    component.isCameraActive = true

    component.onTakePicture()

    expect(component.capture).toHaveBeenCalled()
    expect(component.cameraOff).toHaveBeenCalled()
    expect(component.isCameraActive).toBeFalse()
  })
  it('onCancelCamera should call cameraOff() and set isCameraActive to false', () => {
    spyOn(component, 'onCancelCamera').and.callThrough()
    spyOn(component, 'cameraOff')
    component.isCameraActive = true

    component.onCancelCamera()

    expect(component.cameraOff).toHaveBeenCalled()
    expect(component.isCameraActive).toBeFalse()
  })
  it('onEnableCamera should call setupDevices() and set isCameraActive to true', () => {
    spyOn(component, 'onEnableCamera').and.callThrough()
    spyOn(component, 'setupDevices')
    component.isCameraActive = false

    component.onEnableCamera()

    expect(component.setupDevices).toHaveBeenCalled()
    expect(component.isCameraActive).toBeTrue()
  })
  it('onSubmit() should close the dialog with message submit', () => {
    spyOn(component, 'onSubmit').and.callThrough()
    spyOn(component.dialogRef, 'close')

    component.onSubmit()

    expect(component.dialogRef.close).toHaveBeenCalledWith({message: 'Submit', file: component.selectedFile})
  })
  it('onDeletePicture should set user picture to default, and close dialog with message Delete', () => {
    spyOn(component, 'onDeletePicture').and.callThrough()
    spyOn(component.dialogRef, 'close')

    component.onDeletePicture()

    expect(component.dialogRef.close).toHaveBeenCalledWith({message: 'Delete'})
    expect(component.user.profileImageUrl).toEqual('/assets/grey_profile_img.jpg') // If we change this file path im sorry
  })
  it('closeDialog should close dialog with message Success', () => {
    spyOn(component, 'closeDialog').and.callThrough()
    spyOn(component.dialogRef, 'close')

    component.closeDialog()

    expect(component.dialogRef.close).toHaveBeenCalledWith({message: 'Success', file: undefined})
  })
  it('onFileSelected() should work? idk', () => {
    spyOn(component, 'onFileSelected').and.callThrough()
    spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(() => {return true})

    component.onFileSelected({target: { files: [ {file: true} ]}})

    expect(component.selectedFile).toBeTruthy()
    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalled()
  })
  // FileReader.onLoad is untestable.

  it('capture() should call drawImageFromCanvas and convertBase64toFile()', () => {
    spyOn(component, 'capture').and.callThrough()
    spyOn(component, 'drawImageFromCanvas')
    spyOn(component, 'convertBase64toFile')

    component.capture()

    expect(component.drawImageFromCanvas).toHaveBeenCalled()
    expect(component.convertBase64toFile).toHaveBeenCalled()
  })
  it('convertFile() should use FileReader readAsDataURL() function', () => {
    spyOn(component, 'convertFile').and.callThrough()
    spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(() => {return true})

    component.convertFile(new File([new Blob()], 'file'))

    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(new File([new Blob()], 'file'))
  })

  it('cameraOff() should get srcObject from video', () => {
    component.video.nativeElement.srcObject = new MediaStream([])
    spyOn(component, 'cameraOff').and.callThrough()
    spyOn(component.video.nativeElement.srcObject, 'getTracks').and.returnValue( 
        [{something: 'hi', stop() {return true}}, {something: 'hi', stop() {return true}}], 
    )
  
    component.cameraOff()

    expect(component.video.nativeElement.srcObject).toBeNull()
  })
});