import { Component, HostListener, OnInit } from '@angular/core';
import { EmailUsComponent } from './email-us/email-us.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footerWidth;
  footerHeight;
  foregroundDisplacement;
  mediumScreen
  smallScreen;
  constructor(private modalService: NgbModal, public dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
    this.footerWidth = (<any>window).visualViewport.width
    this.footerHeight = '7rem'
    this.foregroundDisplacement = '4rem'
    this.smallScreen = (<any>window).visualViewport.width < 600
  }

  // openEmailUsPopup() {
  //   this.modalService.open(EmailUsComponent, { centered: true });
  // }

  openDialog(): void {
    const dialogRef = this.dialog.open(EmailUsComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }
  showUpArrow = false;

  @HostListener("window:scroll", []) onWindowScroll() {
    if (window.scrollY >= 200) {
      this.showUpArrow = true;
    } else {
      this.showUpArrow = false;
    }
  }

  scrolltoTop() {
    window.scrollTo(0, 0);
  }
  openCookieNewWindow() {

    window.open('#/cookie-policies',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
  openPrivacyNewWindow() {
    window.open('#/privacy',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
  openTermsNewWindow() {
    window.open('#/terms-and-conditions',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
}
