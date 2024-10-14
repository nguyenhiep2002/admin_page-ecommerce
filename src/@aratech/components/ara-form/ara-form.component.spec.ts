import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraFormComponent } from './ara-form.component';

describe('AraFormComponent', () => {
  let component: AraFormComponent;
  let fixture: ComponentFixture<AraFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
