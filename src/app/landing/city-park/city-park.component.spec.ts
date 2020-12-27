/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CityParkComponent } from './city-park.component';

describe('CityParkComponent', () => {
  let component: CityParkComponent;
  let fixture: ComponentFixture<CityParkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityParkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
