import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraViewExcelComponent } from './ara-view-excel.component';

describe('AraViewExcelComponent', () => {
  let component: AraViewExcelComponent;
  let fixture: ComponentFixture<AraViewExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraViewExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraViewExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
