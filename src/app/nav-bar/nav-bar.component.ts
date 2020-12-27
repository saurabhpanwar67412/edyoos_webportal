import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlacesService } from '../shared/places.service';
import { UserService } from '../shared/user.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { Cart } from '../model/cart/cart.model';
import { CartService } from '../shared/cart.service';
import { AvailableSpotsRequest } from '../model/Booking/available_spots.model';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AvailableSpotsComponent } from '../available-spots/available-spots.component';
import { CommonService } from '../shared/common.service ';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  ordersCount: number = 0;
  cartPropertyGroup: any[] = this.placesService.cartPropertyGroup;
  collapsed = true;
  isLoggedIn;
  total: number;
  cartTopStyle = '-1503px';

  showCartMenu: boolean = true;
  showCartIcon: boolean = true;
  spotNotAvailableErrorMessage = this.cartService.cartSpotNotAvailableText;
  showCartSpinner: boolean;

  constructor(
    public router: Router,
    private placesService: PlacesService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private cartService: CartService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public commonService: CommonService,
  ) { }

  @ViewChild("cartDivElement") cartDivElement: ElementRef;
  @ViewChild("bagIconElement") bagIconElement: ElementRef;
  @ViewChild("deleteIconElement") deleteIconElement: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event) {

    if (this.cartDivElement.nativeElement.contains(event.target)) {
      this.cartTopStyle == '53px'
    }
    else if (this.bagIconElement.nativeElement.contains(event.target)) {

    }
    else if (this.deleteIconElement && this.deleteIconElement.nativeElement.contains(event.target)) {

    }
    else {
      this.cartTopStyle = '-1503px';
    }
  }

  reserveNow: boolean = false;
  ngOnInit(): void {


    this.showCartMenu = !(this.router.url == '/cart');

    this.route.paramMap.subscribe((params) => {

      if (params.get('reservenow')) {
        this.reserveNow = true;
        this.showCartMenu = false;
      }
    });



    if (this.authenticationService.isAuthorized()) {
      this.isLoggedIn = true;
    }
    else {
      if (this.placesService.cartPropertyGroup.length > 0) {
        this.getAvailableSpots();
      }
      this.isLoggedIn = false;
    }


    if (this.authenticationService.isAuthorized() && this.showCartMenu &&
      !this.reserveNow) {
      this.getCartDetails();
    }

    // if (localStorage.getItem('userData')) {
    //   this.isLoggedIn = true;
    // }

    this.ordersCount = this.placesService.cartPropertyGroup.length;
    this.calculateTotal();

    this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {
      this.ordersCount = value.length;
      this.cartPropertyGroup = value;
      this.calculateTotal();

      // if (this.showCartMenu) {
      //   if (this.ordersCount == 0) {
      //     this.cartTopStyle = '-1503px';
      //   }
      //   else {
      //     this.cartTopStyle = '53px';
      //   }
      // }

    });



    this.authenticationService.user.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
    });
  }

  proceedToCheckOut() {
    this.router.navigate(['/cart']);
  }

  getAvailableSpots(index = 0) {
    this.showCartSpinner = true;

    let place = this.placesService.cartPropertyGroup[index];

    let fromDate = new Date(place.searchFromDateTime);
    let toDate = new Date(place.searchToDateTime);

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = fromDate;
    availableSpotsRequest.ToDate = toDate;
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    var availableRequest=[];
    availableRequest.push(availableSpotsRequest);
    this.checkForAvaliableSpots(availableRequest, index);

  }



  checkForAvaliableSpots(availableSpotsRequest, index) {

    this.placesService.CheckForAvaliableSpots(availableSpotsRequest)
      .subscribe((response) => {
        if (response.data[0].isSpotAvaliable) {
          this.placesService.cartPropertyGroup[index].isSpotAvaliable = true;
        }
        else {
          this.placesService.cartPropertyGroup[index].isSpotAvaliable = false;
        }

        index = index + 1;
        if (this.placesService.cartPropertyGroup.length > index) {
          this.getAvailableSpots(index);
        }
        else {
          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
          this.showCartSpinner = false;
        }
        // else {
        //   var notAvailableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == false);
        //   if (notAvailableSpots.length > 0) {
        //     // console.log(notAvailableSpots);
        //     this.openDialog();
        //   }
        //   else {
        //     this.router.navigate(['/cart']);
        //   }
        // }

      }, (error) => {
        this.showCartSpinner = false;
        console.log(error);

        // this.commonService.openSnackBar(error, null);
      });

  }




  openDialog(): void {

    const dialogRef = this.dialog.open(AvailableSpotsComponent, {
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        var availableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == true);
        this.placesService.cartPropertyGroup = availableSpots;

        localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

        this.router.navigate(['/cart']);

      }


    });
  }


  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  openCartDetails() {

    if (this.showCartIcon && this.showCartMenu) {
      if (this.cartTopStyle == '53px') {
        this.cartTopStyle = '-1503px'
      }
      else {
        this.cartTopStyle = '53px';
        if (this.authenticationService.isAuthorized()) {
          this.getCartDetails();
        }
        else {
          if (this.placesService.cartPropertyGroup.length > 0) {
            this.getAvailableSpots();
          }
        }
      }
    }
  }

  getCartDetails() {
    this.showCartSpinner = true;

    this.cartService.getCartDetails().subscribe((response) => {
      this.placesService.cartPropertyGroup = response.data;
      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
      this.showCartSpinner = false;
    }, (error) => {
      this.showCartSpinner = false;
      console.log(error);
    })
  }

  calculateTotal() {
    this.total = 0;
    this.cartPropertyGroup.forEach((place) => {
      this.total += parseFloat(place.calculatedAmount);
    });
    // this.total = Math.round(this.total)
  }

  hideDeleteIcon: boolean = false;
  deletePlace(index: number) {
    this.hideDeleteIcon = true;
    if (this.authenticationService.isAuthorized()) {
      this.cartService.deleteCart(this.placesService.cartPropertyGroup[index].cartID).
        subscribe((response) => {

          this.placesService.cartPropertyGroup.splice(index, 1);

          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
          this.hideDeleteIcon = false;

        }, (error) => {
          this.hideDeleteIcon = false;
          console.log(error);

        })
    }
    else {
      this.placesService.cartPropertyGroup.splice(index, 1);

      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
    }

  }



  signOut() {

    this.authenticationService.logout();

  }
}
