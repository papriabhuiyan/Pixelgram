import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostService } from 'src/app/services/post/post.service';
import { UserService } from 'src/app/services/user/user.service';
import { CreatePostComponent } from './create-post.component';


class dialogMock {
  open(){
    return {
      afterClosed: () => of({}),
    }
  }
}
describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let dialog : any;
  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      declarations: [ CreatePostComponent ],
      imports: [ ReactiveFormsModule, MatDialogModule, HttpClientModule ],
      providers: [
        { provide: MatDialog, useValue: new dialogMock()},
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createPost() should should call postService upload()', () => {
    let postService = TestBed.inject(PostService)
    let userService = TestBed.inject(UserService)

    spyOn(userService, 'getTokenFromLocalStorage').and.returnValue({'token': 'token'})
    spyOn(postService, 'upload').and.returnValue(of(true))
    spyOn(component, 'createPost').and.callThrough()

    component.submitted = false
    component.isSelected = true
    component.message = 'message'
  

    component.createPost()

    expect(userService.getTokenFromLocalStorage).toHaveBeenCalled()
    expect(postService.upload).toHaveBeenCalled()
  })

  it('if postService reutn error error log something', () => {
    let postService = TestBed.inject(PostService)
    let userService = TestBed.inject(UserService)

    spyOn(userService, 'getTokenFromLocalStorage').and.returnValue({'token': 'token'})
    spyOn(postService, 'upload').and.returnValue(throwError(() => new Error()))
    spyOn(component, 'createPost').and.callThrough()
    spyOn(console, 'log')

    component.submitted = false
    component.isSelected = true
    component.message = 'message'

    component.createPost()

    expect(userService.getTokenFromLocalStorage).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  it('should navigate home onCancel()', () => {
    spyOn(component.router, 'navigate')
    component.onCancel()
    expect(component.router.navigate).toHaveBeenCalled()
  })

  it('should open the upload Image modal', () => {
    const spy = spyOn(dialog, 'open').and.callThrough();
    component.openChooseImageDialog();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
