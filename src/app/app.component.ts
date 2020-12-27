import { Component, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { LoaderService } from './shared/loader.service';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event } from '@angular/router';
import { AuthenticationService } from './shared/authentication/authentication.service';
import { Meta } from '@angular/platform-browser';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'parking-lot';
  constructor(private spinner: NgxSpinnerService, private authenticationService: AuthenticationService,
    private loaderService: LoaderService, private _router: Router, private metaTagService: Meta) {

    // this.loaderService.isLoading.subscribe((v) => {
    //   if (v) {
    //     this.spinner.show();
    //   }
    //   else {
    //     this.spinner.hide();
    //   }
    // });



    // this._router.events.subscribe((routerEvent: Event) => {

    //   // On NavigationStart, set showLoadingIndicator to ture
    //   if (routerEvent instanceof NavigationStart) {
    //     this.spinner.show();
    //   }


    //   if (routerEvent instanceof NavigationEnd ||
    //     routerEvent instanceof NavigationError ||
    //     routerEvent instanceof NavigationCancel) {
    //       this.spinner.hide();
    //   }

    // });


  }

  // @HostListener('window:click', ['$event'])
  // googleAddClickListener(event: KeyboardEvent) {
  //    window.gtag_report_conversion(window.location.href);
  // }

  ngOnInit(): void {
    //  environment.apiURL = this.configsLoaderService.ApiURL;
    // environment.apiURL=ApiEndPoint;
    // var assignURLS=new AssignURLS().assignUrl();
    // this.authenticationService.getUserDetailsFromUrl();

    this.metaTagService.addTags([
       { name: 'title', content: 'Edyoos | Easy Online Parking Reservations' },
      {
        name: 'description', content: 'Edyoos is the easiest way to reserve parking for all your travels. Reserve '
          + 'city parking, airport parking, truck &amp; trailer parking, and more. Pay online and find your spot with '
          + 'real-time tracking.'
      },
      { name: 'keywords', content: 'parking, parking reservations, reserved parking, parking services, airport parking' }
      
    ]);

  }






}
