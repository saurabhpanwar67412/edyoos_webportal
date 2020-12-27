import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStepperComponent } from './cart-stepper.component';

describe('CartStepperComponent', () => {
  let component: CartStepperComponent;
  let fixture: ComponentFixture<CartStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
