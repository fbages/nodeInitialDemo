import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XatPrivatComponent } from './xat-privat.component';

describe('XatPrivatComponent', () => {
  let component: XatPrivatComponent;
  let fixture: ComponentFixture<XatPrivatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XatPrivatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XatPrivatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
