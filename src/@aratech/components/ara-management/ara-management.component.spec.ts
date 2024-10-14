import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraManagementComponent } from './ara-management.component';

describe('AraManagementComponent', () => {
  let component: AraManagementComponent;
  let fixture: ComponentFixture<AraManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
