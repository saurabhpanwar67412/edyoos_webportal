import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  isAnnual;

  constructor() {}

  ngOnInit(): void {}

  togglePeriod() {
    this.isAnnual = !this.isAnnual;
  }
}
