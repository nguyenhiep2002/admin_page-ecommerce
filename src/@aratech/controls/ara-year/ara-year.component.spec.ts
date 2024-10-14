import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AraYearComponent } from './ara-year.component';

describe('AraYearComponent', () => {
  let component: AraYearComponent;
  let fixture: ComponentFixture<AraYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AraYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AraYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
