import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { of } from "rxjs";
import { PostComment } from "src/app/model/Comment";
import { User } from "src/app/model/User";
import { PostService } from "src/app/services/post/post.service";
import { AddCommentModalComponent } from "./add-comment-modal.component";

describe("AddCommentModalComponent", () => {
  let component: AddCommentModalComponent;
  let fixture: ComponentFixture<AddCommentModalComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<AddCommentModalComponent>>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let addedComment: PostComment = new PostComment("", 0, 0, new User(0, "", "", "", "", 0, 0, ""), "");

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["post"]);
    postServiceSpy = jasmine.createSpyObj("PostService", ["postComment"]);
    postServiceSpy.postComment.and.returnValue(of(addedComment));
    httpClientSpy.post.and.returnValue(of(addedComment));
    dialogSpy = jasmine.createSpyObj("MatDialogRef<AddCommentModalComponent>", ["close"]);
    await TestBed.configureTestingModule({
      declarations: [AddCommentModalComponent],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: PostService, useValue: postServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("close dialog should close component", () => {
    component.message = "test";
    component.closeDialog();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it("exit to close component and not submit comment", () => {
    component.exit();
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
