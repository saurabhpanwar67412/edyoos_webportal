import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeServeComponent } from './who-we-serve.component';

describe('WhoWeServeComponent', () => {
  let component: WhoWeServeComponent;
  let fixture: ComponentFixture<WhoWeServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoWeServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWeServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
