/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AirportParkComponent } from './airport-park.component';

describe('AirportParkComponent', () => {
  let component: AirportParkComponent;
  let fixture: ComponentFixture<AirportParkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportParkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
