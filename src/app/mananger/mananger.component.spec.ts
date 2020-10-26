import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManangerComponent } from './mananger.component';

describe('ManangerComponent', () => {
  let component: ManangerComponent;
  let fixture: ComponentFixture<ManangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
