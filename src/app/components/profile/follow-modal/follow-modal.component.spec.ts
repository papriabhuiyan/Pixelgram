import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FollowModalComponent } from './follow-modal.component';


describe('FollowModalComponent', () => {
  let component: FollowModalComponent;
  let fixture: ComponentFixture<FollowModalComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<FollowModalComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;
  dialogSpy = jasmine.createSpyObj(
    'MatDialogRef<FollowModalComponent>',
    ['close']
  );

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'routeReuseStrategy', 'onSameUrlNavigation']);
    await TestBed.configureTestingModule({
      declarations: [ FollowModalComponent ],
      imports: [ MatDialogModule ],
      providers: [ {
        provide: MAT_DIALOG_DEFAULT_OPTIONS,
        useValue: { hasBackdrop: false },
      },
      { provide: MatDialogRef, useValue: dialogSpy },
      { provide: MAT_DIALOG_DATA, useValue: {} }, 
      { provide: Router, useValue: routerSpy }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('profile() should route to users profile page and close the dialog', () => {
    component.profile("username");
    expect(routerSpy.navigate).toHaveBeenCalledWith(['user', "username"]);
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
