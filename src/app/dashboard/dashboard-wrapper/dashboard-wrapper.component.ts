import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/common.service ';
import { DASHBOARD_TABS_METADATA } from '../dashboard_metadata';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss']
})
export class DashboardWrapperComponent implements OnInit {

  constructor(private commentService: CommonService
  ) { }
  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA;
  isOpen = true;

  ngOnInit() {
    this.isOpen = this.commentService.SideNavigationBarToggler;

  }

}
