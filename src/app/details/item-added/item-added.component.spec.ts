import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddedComponent } from './item-added.component';

describe('ItemAddedComponent', () => {
  let component: ItemAddedComponent;
  let fixture: ComponentFixture<ItemAddedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAddedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
