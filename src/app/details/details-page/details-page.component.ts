import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  NgZone,
} from '@angular/core';
import { NgbActiveModal, NgbModal, NgbSlideEvent, NgbSlideEventSource, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ShareModalComponent } from '../share-modal/share-modal.component';
// import { MatTabsModule } from '@angular/material/tabs';
// import { ScrollDispatcher } from '@angular/cdk/scrolling';
// import { Mode } from 'src/app/landing/main/main.component.metadata';
import { TabMode } from './details-page.component.metadata';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/shared/search.service';
import { IPlace } from '../../shared/place';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DATE_FORM_METADATA } from './details-page.metadata';
import * as moment from 'moment';
import { MapsAPILoader } from '@agm/core';
import { PlacesService } from 'src/app/shared/places.service';
import { ItemAddedComponent } from '../item-added/item-added.component';
import { SearchRequest } from 'src/app/model/search/search_request.model';
import { Mode } from 'src/app/landing/main/main.component.metadata';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CartService } from 'src/app/shared/cart.service';
import { Cart } from 'src/app/model/cart/cart.model';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import { CommonService } from 'src/app/shared/common.service ';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SEARCH_FORM_METADATA } from 'src/app/search/search-page/search-page.metadata';
import { AddCartComponent } from 'src/app/cart/components/add-cart/add-cart.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('contentNav')
  public contentNav: ElementRef;
  stick;
  contentNavTopOffset;
  selectedTabMode = TabMode.details;
  TabMode = TabMode;
  place: any = {};
  isSoldOut: boolean = false;
  dateForm: FormGroup;
  DATE_FORM_METADATA = DATE_FORM_METADATA;
  config;
  isDateRangeValid: boolean = true;
  formInit = true;
  clearInputDateValues;
  @ViewChild('checkIn')
  public checkIn;
  @ViewChild('checkOut')
  public checkOut;
  geoCoder;
  formattedAddress;
  nearbyPlaces: IPlace[];
  nearbyPlacesLoaded;
  displayedNearbyPlaces: IPlace[];
  nearbyPlacesCount;
  hideExtra;
  fromDisplayDate;
  toDisplayDate;
  httpError: any;
  detailsLoaded: boolean = false;
  showNavigationArrows = true;
  showNavigationIndicators = true;
  pauseOnHover = true;

  @ViewChild('mycarousel', { static: true }) carousel: NgbCarousel;
  imageurl: any;

  @HostListener('window:scroll', ['$event'])
  checkScrollPosition(event) {
    // console.log(
    //   'Scroll Event',
    //   window.pageYOffset,
    //   this.contentNav.nativeElement.offsetLeft
    // );
    // if (this.contentNav) {
    if (window.pageYOffset > this.contentNavTopOffset) {
      this.stick = true;
    } else {
      this.stick = false;
    }
    // }
  }

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private changeDetectorRef: ChangeDetectorRef,
    private placesService: PlacesService,
    public router: Router,
    private authenticationService: AuthenticationService,
    private cartService: CartService,
    private commonService: CommonService,
    configimg: NgbCarouselConfig,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailsPageComponent>,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.config = {
      format: 'YYYY-MM-DD hh:mm:ss a',
      minutesInterval: 15,
      min: moment(),
      weekDayFormat: 'dd',
    };

    this.createForm();
  }

  searchRequest: SearchRequest = new SearchRequest();

  ngOnInit(): void {

    // this.route.paramMap.subscribe((params) => {

    // if (params.get('searchfilterstreet')) {
    //   this.searchRequest.SearchFilterStreet = params.get('searchfilterstreet');
    // }
    // if (params.get('searchfiltercity')) {
    //   this.searchRequest.SearchFilterCity = params.get('searchfiltercity');
    // }

    if (this.data.searchfilterstreet) {
      this.searchRequest.SearchFilterStreet = this.data.searchfilterstreet;
    }
    if (this.data.searchfiltercity) {
      this.searchRequest.SearchFilterCity = this.data.searchfiltercity;
    }
    this.imageurl = environment.apiURL.replace('api', 'images/Amenieties');


    this.searchRequest.Latitude = +this.data.latitude;
    this.searchRequest.Longititude = +this.data.longititude;

    this.searchRequest.FromDate = new Date(this.data.fromdate);
    this.searchRequest.ToDate = new Date(this.data.todate);

    this.dateForm.get(DATE_FORM_METADATA.fromDate).setValue(moment(this.searchRequest.FromDate));
    this.dateForm.get(DATE_FORM_METADATA.toDate).setValue(moment(this.searchRequest.ToDate));


    this.searchRequest.FromTime = moment(this.searchRequest.FromDate).format("hh:mm:ss A");
    this.searchRequest.ToTime = moment(this.searchRequest.ToDate).format("hh:mm:ss A");


    // this.searchRequest.ParkingCategory = this.data.parkingcategory;
    // this.searchRequest.PropertyGroupID = +this.data.id;

    this.place = this.data;

    this.getAvailableSpots(this.data, true);

    // this.search();


    // this.placesService.GetPropertyGroupDetail(+params.get('id')).subscribe((response) => {

    //   if (response.data.length > 0) {
    //     this.place = response.data[0];
    //     console.log(this.place);
    //   }

    // })

    // this.placesService.getPlaceByID().subscribe((response) => {
    //        this.place = response;
    //     });

    // console.log(params.get('id'));
    // console.log(params.get('name'));
    // this.place = this.searchService.selectedPlace;
    // if (!this.place || this.place.id.toString() !== params.get('id')) {
    //   this.placesService.getPlaceByID().subscribe((response) => {
    //     this.place = response;
    //   });
    //   this.initializeGeocode({
    //     lat: this.place.latitude,
    //     lng: this.place.longitude,
    //   });
    // } else {
    //   this.initializeGeocode({
    //     lat: this.place.latitude,
    //     lng: this.place.longitude,
    //   });
    // }
    // });
    // this.getNearbyPlaces();

  }
  ngAfterViewInit() {
    this.contentNavTopOffset =
      this.contentNav.nativeElement.offsetTop -
      this.contentNav.nativeElement.offsetHeight +
      12;

    // if (this.clearInputDateValues) {
    //   setTimeout(() => {
    //     this.checkIn.inputElementValue = '';
    //     this.checkOut.inputElementValue = '';
    //   }, 100);
    // }

  }

  onSlide(slideEvent: NgbSlideEvent) {
    console.log(slideEvent.source);
    console.log(NgbSlideEventSource.ARROW_LEFT);
    console.log(slideEvent.paused);
    console.log(NgbSlideEventSource.INDICATOR);
    console.log(NgbSlideEventSource.ARROW_RIGHT);
  }
  startCarousel() {
    this.carousel.cycle();
  }

  pauseCarousel() {
    this.carousel.pause();
  }

  moveNext() {
    this.carousel.next();
  }
  closeModal() {
    this.dialog.closeAll();
  }
  getPrev() {
    this.carousel.prev();
  }

  goToSlide(slide) {
    this.carousel.select(slide);
  }


  createForm() {
    let fromDate;
    let toDate;

    // if (this.searchRequest.FromDate && this.searchRequest.ToDate) {

    //   fromDate = this.searchRequest.FromDate;
    //   toDate = this.searchRequest.ToDate;
    // }
    // else {
    let now = new Date();
    let minutes = now.getMinutes();
    let hours = now.getHours();
    let m = (Math.round(minutes / 15) * 15) % 60;
    let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
    let quarterIntervalDate = new Date().setHours(h);
    quarterIntervalDate = new Date(quarterIntervalDate).setMinutes(m);
    quarterIntervalDate = new Date(quarterIntervalDate).setSeconds(0);
    fromDate = quarterIntervalDate;
    toDate = moment(quarterIntervalDate).add(1, 'h');
    this.clearInputDateValues = true;
    // }

    this.dateForm = this.formBuilder.group({
      [DATE_FORM_METADATA.fromDate]: [moment(fromDate)],
      [DATE_FORM_METADATA.toDate]: [moment(toDate)],
    });
  }

  // fromDateChange(date) {
  //   // debugger;
  //   // this.fromDisplayDate = date;
  //   const toDateControl = this.dateForm.get(DATE_FORM_METADATA.toDate);
  //   const fromDateControl = this.dateForm.get(DATE_FORM_METADATA.fromDate);
  //   this.isDateRangeValid = true;
  //   if (
  //     date &&
  //     toDateControl.value &&
  //     !moment(date).isSameOrBefore(toDateControl.value) &&
  //     date != toDateControl.value
  //   ) {
  //     this.dateForm.get(DATE_FORM_METADATA.toDate).patchValue(date);
  //     if (moment(date).isSame(toDateControl.value)) {
  //       this.isDateRangeValid = false;
  //     }
  //     // this.checkOut.inputElementValue = '';
  //   }
  // }

  // toDateChange(date) {
  //   // debugger;
  //   // this.toDisplayDate = date;
  //   const toDateControl = this.dateForm.get(DATE_FORM_METADATA.toDate);
  //   const fromDateControl = this.dateForm.get(DATE_FORM_METADATA.fromDate);
  //   this.isDateRangeValid = true;
  //   if (
  //     date &&
  //     fromDateControl.value &&
  //     !moment(date).isSameOrAfter(fromDateControl.value)
  //   ) {
  //     this.dateForm.get(DATE_FORM_METADATA.fromDate).patchValue(date);
  //     if (moment(date).isSame(fromDateControl.value)) {
  //       this.isDateRangeValid = false;
  //     }
  //     // this.checkIn.inputElementValue = '';
  //   }
  //   // if (this.formInit) {
  //   //   this.isDateRangeValid = false;
  //   //   this.formInit = false;
  //   // }
  // }

  getNearbyPlaces() {
    this.placesService.getNearbyPlaces().subscribe((response) => {
      this.nearbyPlaces = response;
      if (this.nearbyPlaces.length > 4) {
        this.nearbyPlacesCount = this.nearbyPlaces.length;
        this.displayedNearbyPlaces = this.nearbyPlaces.slice(0, 4);
        this.hideExtra = true;
      } else {
        this.displayedNearbyPlaces = this.nearbyPlaces;
      }
      this.nearbyPlacesLoaded = true;
    });
  }

  initializeGeocode(address: google.maps.LatLngLiteral) {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.geoCoder.geocode(
        { location: { lat: address.lat, lng: address.lng } },
        (results, status) => {
          console.log(results);
          console.log(status);
          if (status === 'OK') {
            if (results[0]) {
              // debugger
              this.formattedAddress = results[0].formatted_address;
              this.changeDetectorRef.detectChanges();
            }
          }
        }
      );
    });
  }

  openSearchPopup() {
    this.modalService.open(AddCartComponent, { centered: true });
  }
  tabSelected(tabMode) {
    if (tabMode == this.selectedTabMode) {
      return true;
    } else {
      return false;
    }
  }
  changeTabMode(tabMode) {
    this.selectedTabMode = tabMode;
    this.scrollTo(tabMode);
  }

  scrollTo(id) {
    let el = document.getElementById(id);
    let contentStart = document.getElementById('contentStart').offsetTop;
    // const yoffset = el.getBoundingClientRect().y;
    // window.scrollTo(0, yoffset - 103);
    // window.scrollTo(0, yoffset);
    // el.scrollIntoView();
    // setTimeout(() => {
    // window.scrollBy(0, -103);
    // }, 2000);
    window.scrollTo(0, el.offsetTop - 42);
    // this.contentNav.nativeElement.scrollIntoView();
  }

  addToFavorites() {
    this.placesService.addToFavorites();
  }

  showAllPlaces() {
    this.hideExtra = false;
    this.displayedNearbyPlaces = this.nearbyPlaces;
    this.changeDetectorRef.detectChanges();
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe((response) => {
      this.placesService.cartPropertyGroup = response.data;
      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

    }, (error) => {
      console.log(error);
    })
  }

  reserveNow(place) {
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
    this.placesService.CheckForAvaliableSpots(availableRequest)
      .subscribe((response) => {

        if (response.data[0].isSpotAvaliable) {
          this.placesService.cartPropertyGroup = [];

          this.placesService.cartPropertyGroup.push(place);

          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
          this.dialogRef.close(true);
          this.router.navigate(['/cart', { reservenow: true }]);
        }
        else {
          this.commonService.openSnackBar("Spot is not available.", null);
        }
      }, (error) => {
        this.commonService.openSnackBar(error, null);
      })
  }

  getAvailableSpots(place, checkSoldOut = false) {

    let fromDate = new Date(place.searchFromDateTime);
    let toDate = new Date(place.searchToDateTime);

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = fromDate;
    availableSpotsRequest.ToDate = toDate;
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    var availablerequest=[];
    availablerequest.push(availableSpotsRequest);
    this.placesService.CheckForAvaliableSpots(availablerequest)
      .subscribe((response) => {
        if (response.data[0].isSpotAvaliable) {
          if (!checkSoldOut) {
            this.reserveNow(place);
          }
          this.isSoldOut = false;
        }
        else {
          // this.commonService.openSnackBar("Spot is not available.", null);
          this.isSoldOut = true;
        }
      }, (error) => {
        this.commonService.openSnackBar(error, null);
      })
  }

  addToCart() {

    if (this.placesService.cartPropertyGroup.length <= 4) {

      if (this.authenticationService.isAuthorized()) {

        let cart: Cart[] = [];

        if (this.placesService.cartPropertyGroup) {

          let cartDetails = new Cart();
          cartDetails.PropertyGroupID = this.place.propertyGroupID;
          cartDetails.FromDate = this.place.fromDate;
          cartDetails.ToDate = this.place.toDate;
          cartDetails.Amount = this.place.calculatedAmount;
          this.ngZone.run(() => {
            this.dialogRef.close();
          });
          cart.push(cartDetails);

          this.cartService.addCart(cart).subscribe((response) => {

            this.getCartDetails();


          }, (error) => {
            console.log(error);

          });

        }

      }
      else {

        this.placesService.cartPropertyGroup.push(this.place);

        localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

        this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

      }
      this.ngZone.run(() => {
        this.dialogRef.close(true);
      });
    }
    else {
      this.commonService.openSnackBar('Maximum 5 orders can be added to the cart bag', null);
    }

  }


  goToPlace(propertyGroupID) {
    console.log(propertyGroupID);

    let detailsRequest: any = {};
    if (this.searchRequest.SearchFilterCity) {
      detailsRequest.searchfiltercity = this.searchRequest.SearchFilterCity;
    }
    if (this.searchRequest.SearchFilterStreet) {
      detailsRequest.searchfilterstreet = this.searchRequest.SearchFilterStreet;
    }

    detailsRequest.latitude = this.searchRequest.Latitude;
    detailsRequest.longititude = this.searchRequest.Longititude;
    detailsRequest.fromdate = moment(this.searchRequest.FromDate).format("YYYY-MM-DD HH:mm:ss");
    detailsRequest.todate = moment(this.searchRequest.ToDate).format("YYYY-MM-DD HH:mm:ss");
    // detailsRequest.fromtime = this.searchRequest.FromTime;
    // detailsRequest.totime = this.searchRequest.ToTime;
    detailsRequest.parkingcategory = this.searchRequest.ParkingCategory;
    this.router.navigate([`/details/${propertyGroupID}`, detailsRequest]);

  }

  fromDateChange(date) {

    const toDateControl = this.dateForm.get(DATE_FORM_METADATA.toDate);
    const fromDateControl = this.dateForm.get(DATE_FORM_METADATA.fromDate);
    if (
      date &&
      toDateControl.value &&
      moment(date).isSameOrAfter(toDateControl.value)
    ) {
      this.isDateRangeValid = false;
    }
    else {
      this.isDateRangeValid = true;
    }

    if (this.isDateRangeValid) {
      this.search();
    }

  }

  toDateChange(date) {

    const toDateControl = this.dateForm.get(DATE_FORM_METADATA.toDate);
    const fromDateControl = this.dateForm.get(DATE_FORM_METADATA.fromDate);

    if (
      date &&
      fromDateControl.value &&
      moment(date).isSameOrBefore(fromDateControl.value)
    ) {
      this.isDateRangeValid = false;
    }
    else {
      this.isDateRangeValid = true;
    }
    if (this.isDateRangeValid) {
      this.search();
    }

  }


  search() {

    let fromDate = this.dateForm.get(DATE_FORM_METADATA.fromDate).value;
    let toDate = this.dateForm.get(DATE_FORM_METADATA.toDate).value;

    this.searchRequest.FromDate = fromDate;
    this.searchRequest.ToDate = toDate;
    this.searchRequest.FromTime = moment(this.searchRequest.FromDate).format("hh:mm:ss A");
    this.searchRequest.ToTime = moment(this.searchRequest.ToDate).format("hh:mm:ss A");

    if (this.searchRequest.ParkingCategory == Mode.City_Parking) {

      this.placesService.getSearchResultForAuto(this.searchRequest)
        .subscribe((response) => {
          // this.detailsLoaded = true;
          this.place = response.data.find(x => x.propertyGroupID == this.searchRequest.PropertyGroupID);
          this.getAvailableSpots(this.place, true);

          this.displayedNearbyPlaces = response.data.filter(x => x.propertyGroupID != this.searchRequest.PropertyGroupID);

          // this.displayedNearbyPlaces=response.data;
          // console.log(this.place);
        }, (error) => {

          this.httpError = error;
        });

    }
    else if (this.searchRequest.ParkingCategory == Mode.Boat) {
      this.placesService.GetSearchResultforBoats(this.searchRequest)
        .subscribe((response) => {
          // this.detailsLoaded = true;
          this.place = response.data.find(x => x.propertyGroupID == this.searchRequest.PropertyGroupID);
          this.getAvailableSpots(this.place, true);
          this.displayedNearbyPlaces = response.data.filter(x => x.propertyGroupID != this.searchRequest.PropertyGroupID);
          // console.log(this.place);
        }, (error) => {

          this.httpError = error;
        });
    }
    else if (this.searchRequest.ParkingCategory == Mode.Helicopter) {
      this.placesService.GetSearchResultforHelicopter(this.searchRequest)
        .subscribe((response) => {
          // this.detailsLoaded = true;
          this.place = response.data.find(x => x.propertyGroupID == this.searchRequest.PropertyGroupID);
          this.getAvailableSpots(this.place, true);
          this.displayedNearbyPlaces = response.data.filter(x => x.propertyGroupID != this.searchRequest.PropertyGroupID);
          // console.log(this.place);
        }, (error) => {

          this.httpError = error;
        });
    }
    else if (this.searchRequest.ParkingCategory == Mode.Seaplane) {

      this.placesService.GetSearchResultforSeaPlanes(this.searchRequest)
        .subscribe((response) => {
          // this.detailsLoaded = true;
          this.place = response.data.find(x => x.propertyGroupID == this.searchRequest.PropertyGroupID);
          this.getAvailableSpots(this.place, true);
          this.displayedNearbyPlaces = response.data.filter(x => x.propertyGroupID != this.searchRequest.PropertyGroupID);
          // console.log(this.place);
        }, (error) => {

          this.httpError = error;
        });
    }
    else if (this.searchRequest.ParkingCategory == Mode.Airport_Parking) {

      this.placesService.GetSearchResultforAirPort(this.searchRequest)
        .subscribe((response) => {
          // this.detailsLoaded = true;
          this.place = response.data.find(x => x.propertyGroupID == this.searchRequest.PropertyGroupID);
          this.getAvailableSpots(this.place, true);
          this.displayedNearbyPlaces = response.data.filter(x => x.propertyGroupID != this.searchRequest.PropertyGroupID);
          // console.log(this.place);
        }, (error) => {

          this.httpError = error;
        });
    }
  }

}
