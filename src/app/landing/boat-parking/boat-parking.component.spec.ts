/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoatParkingComponent } from './boat-parking.component';

describe('BoatParkingComponent', () => {
  let component: BoatParkingComponent;
  let fixture: ComponentFixture<BoatParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
