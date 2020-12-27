import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-item-added',
  templateUrl: './item-added.component.html',
  styleUrls: ['./item-added.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ItemAddedComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.activeModal.dismiss();
    // }, 3000);
  }

  closePopup() {
    this.activeModal.dismiss();
  }
}
