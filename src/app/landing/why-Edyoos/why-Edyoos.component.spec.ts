/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WhyEdyoosComponent } from './why-Edyoos.component';

describe('WhyEdyoosComponent', () => {
  let component: WhyEdyoosComponent;
  let fixture: ComponentFixture<WhyEdyoosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyEdyoosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyEdyoosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
