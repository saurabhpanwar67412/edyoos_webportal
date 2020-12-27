import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD_TABS_METADATA } from './dashboard_metadata';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tabName;
  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA
  constructor(private router: Router) {
    router.events.subscribe((url: any) => {
      this.tabName =
        router.url.replace('/user/dashboard/', '')
    });
  }

  ngOnInit(): void {
  }

  isSelected(tabName) {
    if (tabName === this.tabName) {
      return true;
    }
  }
  route(url: string) {
    this.router.navigateByUrl(url);
  }
  urlroute(tabName) {
    var url = window.location.origin;
  }

}
