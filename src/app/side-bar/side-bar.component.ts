import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD_TABS_METADATA } from '../dashboard/dashboard_metadata';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(private router: Router) {
    router.events.subscribe((url: any) => this.tabName = router.url.replace('/user/dashboard/', ''));
  }
  @Input() isOpen = false;
  tabName;
  // @Input() tabName = DASHBOARD_TABS_METADATA.dashboard;
  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA;

  ngOnInit() {
  }
  isSelected(tabName) {
    if (tabName === this.tabName) {
      return true;
    }
  }

  route(url: string) {
    this.router.navigateByUrl(url);
  }

}
