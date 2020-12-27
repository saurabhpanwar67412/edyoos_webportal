import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUsComponent } from './email-us.component';

describe('EmailUsComponent', () => {
  let component: EmailUsComponent;
  let fixture: ComponentFixture<EmailUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
