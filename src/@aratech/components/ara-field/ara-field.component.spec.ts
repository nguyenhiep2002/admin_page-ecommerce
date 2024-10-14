import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraFieldComponent } from './ara-field.component';

describe('AraFieldComponent', () => {
  let component: AraFieldComponent;
  let fixture: ComponentFixture<AraFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
