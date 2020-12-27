import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SecurityContext,
  NgZone,
  Inject,
  HostListener,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from 'src/app/shared/places.service';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { Mode, vehicleCategoryEnum } from 'src/app/landing/main/main.component.metadata';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/shared/search.service';
import { SEARCH_FORM_METADATA, SortMethodEnum } from './search-page.metadata';
import { MapsAPILoader } from '@agm/core';
import { SearchBaseComponent } from './search-base.component';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { IPlace } from 'src/app/shared/place';
import sort from 'fast-sort';
import { SearchRequest } from 'src/app/model/search/search_request.model';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CartService } from 'src/app/shared/cart.service';
import { PricingType, PricingTypeText } from 'src/app/shared/enum/pricing_type_enum';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import { CommonService } from 'src/app/shared/common.service ';
import { AvailableSpotsComponent } from 'src/app/available-spots/available-spots.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailsPageComponent } from 'src/app/details/details-page/details-page.component';
import { Cart } from 'src/app/model/cart/cart.model';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery/dist/jquery.min.js';
import { convertIntoDate } from 'src/app/shared/datetime.utility';
class DeleteAllCart {
  CartID: string[] = [];
}
declare var window: any;
declare var jQuery:any;
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent extends SearchBaseComponent
  implements OnInit, AfterViewInit {
  pricingType = PricingTypeText;
  pricingTypeID = PricingType;
  isHidden = false;
  imageurl: string;
  fromDate;
  toDate;
  dateForm: FormGroup;
  config = {
    format: 'YYYY-MM-DD hh:mm:ss A',
    minutesInterval: 15,
    // hours24Format: 'HH',
    min: moment(),
    weekDayFormat: 'dd',
  }; httpError: any;
  isLoggedIn: boolean;
  fontposition: number = 0;
  fromMinDate = moment();
  fromDateError;
  duration;
  now;
  // isFromDateFromatted;
  // isToDateFromatted;
  isDateRangeValid: boolean = true;
  formInit = true;
  // lat;
  // lng;
  searchForm: FormGroup;
  SEARCH_FORM_METADATA = SEARCH_FORM_METADATA;
  SortMethodEnum = SortMethodEnum;
  Mode = Mode;
  vehicleCategoryEnum = vehicleCategoryEnum;
  modePlaceholder;
  displayLength;
  @ViewChild('checkIn')
  public checkIn;
  @ViewChild('checkOut')
  public checkOut;
  data = {};
  places: IPlace[];
  userLocationMarkerAnimation: string;
  displayedPlaces: any[] = [];
  selectedMode;
  sortMethod;
  placesLoaded;
  hideExtra;
  placesCount;
  firstCalltoDateListeners;
  isCallerFromDateChangeListner;
  isCallerToDateChangeListner;
  fromDisplayDate;
  toDisplayDate;
  @ViewChild('searchBar')
  public searchElementRef: ElementRef;
  ordersCount: number = 0;
  cartTopStyle = '-1503px';
  image: any;
  hover_image: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private placesService: PlacesService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    protected mapsAPILoader: MapsAPILoader,
    private searchService: SearchService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private cartService: CartService,
    public commonService: CommonService,
    public dialog: MatDialog,
    private metaTagService: Meta
  ) {
    super(mapsAPILoader);
    this.createForms();

    // this.config = {
    //   format: 'YYYY-MM-DD hh:mm:ss A',
    //   minutesInterval: 15,
    //   // hours24Format: 'HH',
    //   min: moment(),
    //   weekDayFormat: 'dd',
    // };
  }


  cartPropertyGroup: any[];

  total: number;
  spotNotAvailableErrorMessage = this.cartService.cartSpotNotAvailableText;

  ngOnInit(): void {
    // $('[data-toggle="tooltip"]').tooltip();
    this.cartPropertyGroup = this.placesService.cartPropertyGroup;
    this.imageurl = environment.apiURL.replace('api', 'images/Amenieties');
    //this.imageurl = environment.blobURL + '/' + environment.blobAmenitiesContainer;
    if (this.authenticationService.isAuthorized()) {
      this.getCartDetails();
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
      this.calculateTotal();
    }

    this.authenticationService.user.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
      else {
        this.isLoggedIn = false;
      }
    });

    this.getDataFromQueryParams();

    this.ordersCount = this.placesService.cartPropertyGroup.length;

    this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {
      this.ordersCount = value.length;
      this.cartPropertyGroup = value;
      this.calculateTotal();
    });


    this.metaTagService.updateTag(
      { name: 'title', content: 'Reserve Parking Online' }
    );
    this.metaTagService.updateTag(
      {
        name: 'description', content: 'Reserve parking online for events, airport parking, cruise parking, truck &amp; '
          + 'trailer parking, semi-truck parking, and more. Contact-free, cash-free online parking. Reserve ' +
          'and pay online, park on the spot. Hassle-free. Choose your parking spot.'
      }
    );

    this.metaTagService.updateTag(
      {
        name: 'keywords', content: 'parking, parking reservations, reserved parking, airport parking, event parking, ' +
          'parking booking, city parking, truck and trailer parking'
      }
    );
    jQuery('#datetimepicker').datetimepicker({
      minDate:new Date(),
      format:'Y-m-d h:i:s A',
      formatTime:"h:i A",
      step:60,
      allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ] ,
       onSelectTime:function( ct ){
        jQuery('#todatetimepicker').datetimepicker('hide');
        jQuery('#datetimepicker').datetimepicker('hide');
       jQuery('#todatetimepicker').datetimepicker('show');
       var today=new Date(jQuery('#datetimepicker').val());
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').val(today);
      },
      onChangeDateTime:function( ct ){
       debugger;
       var today=new Date(ct);
       today.setHours(today.getHours() + 1);
       jQuery('#todatetimepicker').datetimepicker({minDate:ct,format:'Y-m-d h:i:s A',
       value:today,
      formatTime:"h:i A",
      step:60,
       allowTimes:[
        '00:00','00:15', '00:30', '00:45','01:00', 
        '01:15', '01:30', '01:45','02:00', 
        '02:15', '02:30', '02:45','03:00', 
        '03:15', '03:30', '03:45','04:00',
        '04:15', '04:30', '04:45','05:00', 
        '05:15', '05:30', '05:45','06:00',
        '06:15', '06:30', '06:45','07:00', 
        '07:15', '07:30', '07:45','08:00',
        '08:15', '08:30', '08:45','09:00', 
        '09:15', '09:30', '09:45','10:00',
        '10:15', '10:30', '10:45','11:00', 
        '11:15', '11:30', '11:45','12:00',
        '12:15', '12:30', '12:45','13:00', 
        '13:15', '13:30', '13:45','14:00',
        '14:15', '14:30', '14:45','15:00', 
        '15:15', '15:30', '15:45','16:00',
        '16:15', '16:30', '16:45','17:00', 
        '17:15', '17:30', '17:45','18:00',
        '18:15', '18:30', '18:45','19:00', 
        '19:15', '19:30', '19:45','20:00',
        '20:15', '20:30', '20:45','21:00', 
        '21:15', '21:30', '21:45','22:00',
        '22:15', '22:30', '22:45','23:00', 
        '23:15', '23:30', '23:45'
       ],
       onSelectTime:function( ct ){
       
        }
      });
       
       }
       
       
  });
    // jQuery('#todatetimepicker').datetimepicker({

    //   minDate:new Date(),
    //   format:'Y-m-d H:i A',
    //   onChangeDateTime:function( ct ){
    //   jQuery('#todatetimepicker').datetimepicker('hide');
    //   }
    // });
  }

  calculateTotal() {
    this.total = 0;
    this.cartPropertyGroup.forEach((place) => {
      this.total += parseFloat(place.calculatedAmount);
    });
  }

  signOut() {
    window.gtag_report_conversion(window.location.href);
    this.authenticationService.logout();
  }

  ngAfterViewInit() {

    this.initializeAutoComplete();

  }
  searchAddress: any = {};

  assignAddress(formatedAddress: any) {

    // this.searchAddress = formatedAddress;
    // let searchAddress: string;

    // if (formatedAddress.street_number) {
    //   searchAddress = formatedAddress.street_number;
    // }
    // if (formatedAddress.locality) {
    //   searchAddress = searchAddress + "," + formatedAddress.locality;
    // }
    // if (formatedAddress.administrative_area_level_1) {
    //   searchAddress = searchAddress + "," + formatedAddress.administrative_area_level_1;
    // }
    // if (formatedAddress.country) {
    //   searchAddress = searchAddress + "," + formatedAddress.country;
    // }

    // this.searchForm
    //   .get(SEARCH_FORM_METADATA.searchBar)
    //   .patchValue(searchAddress);

    // this.search();
  }

  getDataFromQueryParams() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('lat') && params.get('lng')) {
        this.currentLocation = {
          lat: parseFloat(params.get('lat')),
          lng: parseFloat(params.get('lng')),
        };
      }


      if (params.get('mode')) {

        this.selectedMode = params.get('mode');
        if (this.selectedMode == Mode.Boat || this.selectedMode == Mode.Seaplane) {
          this.displayLength = true;
          if (params.get('vehiclelength')) {
            this.searchAddress.vehiclelength = params.get('vehiclelength');

          }
          this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).setValue(this.searchAddress.vehiclelength);
          this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).setValidators(Validators.required);
          this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).updateValueAndValidity();

        }
      } else {
        this.selectedMode = Mode.City_Parking;
      }
      this.searchForm
        .get(SEARCH_FORM_METADATA.mode)
        .patchValue(this.selectedMode);

      let searchAddress: string;

      if (params.get('street')) {
        this.searchAddress.street_number = params.get('street');
        // searchAddress = params.get('street');
      }
      if (params.get('locality')) {
        this.searchAddress.locality = params.get('locality');
        // searchAddress = searchAddress ? searchAddress + ',' + params.get('locality') : params.get('locality');
      }
      if (params.get('state')) {
        this.searchAddress.state = params.get('state');
      }

      if (params.get('search')) {
        searchAddress = params.get('search');
        // searchAddress = searchAddress + ',' + params.get('search');
      }




      this.searchForm
        .get(SEARCH_FORM_METADATA.searchBar)
        .patchValue(searchAddress);

      // this.changeSearchMode(this.selectedMode);

      if (params.get('length')) {
        this.searchForm
          .get(SEARCH_FORM_METADATA.vehicleLength)
          .patchValue(params.get('length'));
      }

      this.search();

    })

    // this.route.queryParams.subscribe((params) => {
    //   if (params['lat'] && params['lng']) {
    //     this.currentLocation = {
    //       lat: parseFloat(params['lat']),
    //       lng: parseFloat(params['lng']),
    //     };
    //   }
    //   if (params['mode']) {
    //     this.selectedMode = params['mode'];
    //   } else {
    //     this.selectedMode = Mode.Auto;
    //   }
    //   this.searchForm
    //     .get(SEARCH_FORM_METADATA.mode)
    //     .patchValue(this.selectedMode);

    //   let searchAddress: string;

    //   if (params['street']) {
    //     this.searchAddress.street_number=params['street'];
    //     searchAddress = params['street'];
    //   }
    //   if (params['locality']) {
    //     this.searchAddress.locality=params['locality'];
    //     searchAddress = searchAddress + ',' + params['locality'];
    //   }

    //   if (params['search']) {
    //     searchAddress = searchAddress + ',' + params['search'];
    //   }


    //   this.searchForm
    //   .get(SEARCH_FORM_METADATA.searchBar)
    //   .patchValue(searchAddress);

    //   // this.changeSearchMode(this.selectedMode);

    //   if (params['length']) {
    //     this.searchForm
    //       .get(SEARCH_FORM_METADATA.vehicleLength)
    //       .patchValue(params['length']);
    //   }

    //   this.search();

    // });
  }

  createForms() {
    let now = new Date();
    let minutes = now.getMinutes();
    let hours = now.getHours();
    let m = (Math.round(minutes / 15) * 15) % 60;
    let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
    let quarterIntervalDate = new Date().setHours(h);
    quarterIntervalDate = new Date(quarterIntervalDate).setMinutes(m);
    quarterIntervalDate = new Date(quarterIntervalDate).setSeconds(0);
    // ;
    this.now = moment(quarterIntervalDate);
    let compare = new Date(this.now).setMinutes(new Date(this.now).getMinutes() - 15);
    if (moment(compare).isSameOrBefore(new Date())) {
      this.now = new Date(this.now).setMinutes(new Date(this.now).getMinutes() + 15);
    }
    const toDate = moment(this.now).add(1, 'h');

    this.searchForm = this.formBuilder.group({
      [SEARCH_FORM_METADATA.searchBar]: ['', [Validators.required]],
      [SEARCH_FORM_METADATA.vehicleLength]: [''],
      [SEARCH_FORM_METADATA.mode]: [Mode.City_Parking],
    });
    this.dateForm = this.formBuilder.group({
      [SEARCH_FORM_METADATA.fromDate]: [moment(new Date(this.now)).format("YYYY-MM-DD hh:mm:ss A")],
      [SEARCH_FORM_METADATA.toDate]: [moment(toDate).format("YYYY-MM-DD hh:mm:ss A")],
      [SEARCH_FORM_METADATA.sort]: ['']
    });

  }

  fromDateChange(date) {

    // this.fromDisplayDate = date;
    const toDateControl = this.dateForm.get(SEARCH_FORM_METADATA.toDate);
    const fromDateControl = this.dateForm.get(SEARCH_FORM_METADATA.fromDate);
    // this.isDateRangeValid = true;
    if (
      date &&
      toDateControl.value &&
      moment(date).isSameOrAfter(toDateControl.value)
    ) {

      this.isDateRangeValid = false;
      // isSameOrBefore
      // this.isCallerFromDateChangeListner = true;
      // this.dateForm.get(SEARCH_FORM_METADATA.toDate).patchValue(date);
    }
    else {
      this.isDateRangeValid = true;
    }

    //  else if (moment(date).isSame(toDateControl.value)) {
    //     this.isDateRangeValid = false;
    //   }

    // check on caller to prevent circular loop
    // if (!this.isCallerToDateChangeListner) {
    //   this.filterPlacesByDate();
    // }
    // this.isCallerToDateChangeListner = false;
  }

  toDateChange(date) {
    // ;
    // this.toDisplayDate = date;
    const toDateControl = this.dateForm.get(SEARCH_FORM_METADATA.toDate);
    const fromDateControl = this.dateForm.get(SEARCH_FORM_METADATA.fromDate);
    // this.isDateRangeValid = true;
    if (
      date &&
      fromDateControl.value &&
      moment(date).isSameOrBefore(fromDateControl.value)
    ) {
      this.isDateRangeValid = false;
      // this.isCallerToDateChangeListner = true;
      // this.dateForm.get(SEARCH_FORM_METADATA.fromDate).patchValue(date);
      // this.checkIn.inputElementValue = '';
    }
    else {
      this.isDateRangeValid = true;
    }

    // if (moment(date).isSame(fromDateControl.value)) {
    //   this.isDateRangeValid = false;
    // }

    // check on caller to prevent circular loop
    // if (!this.isCallerFromDateChangeListner) {
    //   this.filterPlacesByDate();
    // }
    // this.isCallerFromDateChangeListner = false;

  }



  initializeAutoComplete() {

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();

      // if (!this.currentLocation) {
      //   this.getCurrentPosition();
      // } else {
      //   this.getAddress(this.currentLocation);
      // }

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.currentLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          this.searchAddress = {};

          console.log(place);

          for (var i = 0; i < place.address_components.length; i++) {

            var addressType = place.address_components[i].types[0];
            if (this.componentForm[addressType]) {
              var val = place.address_components[i][this.componentForm[addressType]];

              if (addressType == 'street_number' || addressType == 'route') {
                this.searchAddress.street_number = this.searchAddress.street_number ? this.searchAddress.street_number + ' ' + val :
                  val;
              }

              else if (addressType == 'locality') {
                // address.locality=address+','+val;
                this.searchAddress.locality = val;
              }
              else if (addressType == 'administrative_area_level_1') {
                // address=address+','+val;
                this.searchAddress.state = val;
              }

              else if (addressType == 'country') {
                // address.country=address+','+val;
                this.searchAddress.country = val;
              }
            }
          }


          if (this.searchForm.valid) {
            this.search();
          }

        });
      });
    });
  }

  toggleDisplay() {
    this.isHidden = !this.isHidden;
    setTimeout(() => {
      if (!this.isHidden) {
        this.firstTimeLoad = true;
        if (this.displayedPlaces.length > 0) {
          this.initializeMap(this.displayedPlaces[0].latitude, this.displayedPlaces[0].longitude);
        }
      }
    }, 100);

  }

  showCartSpinner: boolean = false;

  openCartDetails() {

    if (this.cartTopStyle == '53px') {
      this.cartTopStyle = '-1503px'
    }
    else {
      this.cartTopStyle = '53px';
      if (this.authenticationService.isAuthorized()) {
        this.getCartDetails();
      }
      else {
        // this.getCartAvailableSpots();
        this.CheckAvailableSpots();
      }

    }
  }

  CheckAvailableSpots() {
    this.showCartSpinner = true;
    let availableSpots: AvailableSpotsRequest[] = [];

    this.placesService.cartPropertyGroup.forEach((value, index) => {
      let availableSpot = new AvailableSpotsRequest();
      availableSpot.PropertyGroupID = value.propertyGroupID;
      availableSpot.FromDate = new Date(moment(value.searchFromDateTime).format("MM-DD-YYYY"));
      availableSpot.ToDate = new Date(moment(value.searchToDateTime).format("MM-DD-YYYY"));
      availableSpot.FromTime = moment(value.searchFromDateTime).format("hh:mm:ss A");
      availableSpot.ToTime = moment(value.searchToDateTime).format("hh:mm:ss A");
      availableSpots.push(availableSpot);
    });

    this.placesService.CheckForAvaliableSpots(availableSpots).subscribe((response) => {

      let spots: any[] = response.data;
      this.placesService.cartPropertyGroup.forEach((value, index) => {
        value.isSpotAvaliable = spots[index].isSpotAvaliable;
      });
      this.showCartSpinner = false;
    }, (error) => {
      this.showCartSpinner = false;
      console.log(error);

    });

  }

  getCartDetails() {

    this.showCartSpinner = true;
    this.cartService.getCartDetails().subscribe((response) => {

      this.placesService.cartPropertyGroup = response.data;
      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
      this.hideAddCartBtn = false;
      this.showCartSpinner = false;
    }, (error) => {
      this.hideAddCartBtn = false;
      this.showCartSpinner = false;
      console.log(error);
    })
  }

  changeSearchMode(mode) {
    if (mode == Mode.Boat || mode == Mode.Seaplane) {
      this.displayLength = true;
      this.modePlaceholder = mode;

      this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).setValidators(Validators.required);
      this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).updateValueAndValidity();

    } else {
      this.displayLength = false;

      this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).clearValidators();
      this.searchForm.get(SEARCH_FORM_METADATA.vehicleLength).updateValueAndValidity();
    }
    this.selectedMode = mode;

    if (this.searchForm.valid) {
      this.search();
    }

  }

  reserveNow() {
    this.router.navigate(['/cart']);
  }

  getCartAvailableSpots(index = 0) {
    this.showCartSpinner = true;
    let place = this.placesService.cartPropertyGroup[index];

    let fromDate = new Date(place.searchFromDateTime);
    let toDate = new Date(place.searchToDateTime);

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = new Date(moment(fromDate).format("MM-DD-YYYY"));
    availableSpotsRequest.ToDate = new Date(moment(toDate).format("MM-DD-YYYY"));
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");

    this.checkForAvaliableSpots(availableSpotsRequest, index);

  }

  openDialog(): void {
    window.gtag_report_conversion(window.location.href);

    const dialogRef = this.dialog.open(AvailableSpotsComponent, {
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        if (this.authenticationService.isAuthorized()) {
          let notAvailableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == false);
          this.deleteCartDetails(notAvailableSpots);
        }
        else {
          var availableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == true);
          this.placesService.cartPropertyGroup = availableSpots;

          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

          this.router.navigate(['/cart']);
        }


      }
    });
  }

  public getWidth() {
    if (window.screen.width > 1400) {
      return '500px';
    }
    if (window.screen.width < 991) {
      return '80%';
    }

    return 'auto';
  }
  public getPosition(): any {
    if (window.screen.width > 1400) {
      return { top: '150px' };
    }
    return { top: '50px' };
  }
  deleteCartDetails(placeList: any[]) {
    let deleteAllCart = new DeleteAllCart();
    placeList.forEach((value, index) => {
      deleteAllCart.CartID.push(value.cartID);

    });

    this.cartService.deleteAllCart(deleteAllCart).
      subscribe((response) => {

        var availableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == true);
        this.placesService.cartPropertyGroup = availableSpots;

        localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
        this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

        this.router.navigate(['/cart']);

      }, (error) => {
        this.httpError = error;

      })

  }



  checkForAvaliableSpots(availableSpotsRequest, index) {

    this.placesService.CheckForAvaliableSpots(availableSpotsRequest)
      .subscribe((response) => {
        if (response.data.isSpotAvaliable) {
          this.placesService.cartPropertyGroup[index].isSpotAvaliable = true;
        }
        else {
          this.placesService.cartPropertyGroup[index].isSpotAvaliable = false;
        }

        index = index + 1;
        if (this.placesService.cartPropertyGroup.length > index) {
          this.getCartAvailableSpots(index);
        }
        else {
          this.showCartSpinner = false;
        }
        // else {
        //   var notAvailableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == false);
        //   if (notAvailableSpots.length > 0) {
        //     this.openDialog();
        //   }
        //   else {
        //     this.router.navigate(['/cart']);
        //   }

        // }

      }, (error) => {
        console.log(error);
        this.showCartSpinner = false;
      });

  }

  hideAddCartBtn: boolean = false;
  addToCart(place, reserveNow = false) {
    window.gtag_report_conversion(window.location.href);

    if (this.placesService.cartPropertyGroup.length <= 4) {

      this.hideAddCartBtn = true;
      let fromDate = this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value;
      let toDate = this.dateForm.get(SEARCH_FORM_METADATA.toDate).value;
      if (place.pricingCode == this.pricingTypeID.Monthly) {
        toDate = moment(fromDate).add(1, 'M').format('MM-DD-YYYY hh:mm:ss A');
        place.searchToDateTime = toDate;
      }

      let cart: Cart[] = [];
      let cartDetails = new Cart();
      cartDetails.PropertyGroupID = place.propertyGroupID;
      cartDetails.FromDate = new Date(moment(fromDate).format("MM-DD-YYYY"));
      cartDetails.ToDate = new Date(moment(toDate).format("MM-DD-YYYY"));
      cartDetails.FromTime = moment(fromDate).format("hh:mm:ss A");
      cartDetails.ToTime = moment(toDate).format("hh:mm:ss A");

      cartDetails.Amount = place.calculatedAmount
      cart.push(cartDetails);

      if (this.authenticationService.isAuthorized()) {

        this.cartService.addCart(cart).subscribe((response: any) => {

          if (response.data.isSpotAvaliable) {
            if (!reserveNow) {
              this.getCartDetails();
            }
            else {

              this.hideAddCartBtn = false;

              this.placesService.cartPropertyGroup = [];

              place.cartID = response.data.insertedRecordID;
              this.placesService.cartPropertyGroup.push(place);

              localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

              this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

              this.router.navigate(['/cart', { reservenow: true }]);

            }

          }
          else {
            this.hideAddCartBtn = false;
            this.commonService.openSnackBar(response.data.message, null);
          }


        }, (error) => {
          this.hideAddCartBtn = false;
          this.commonService.openSnackBar(error, null);
        });

      }
      else {
        let availableSpots: AvailableSpotsRequest[] = [];

        this.placesService.cartPropertyGroup.forEach((value, index) => {
          let availableSpot = new AvailableSpotsRequest();
          availableSpot.PropertyGroupID = value.propertyGroupID;
          availableSpot.FromDate = new Date(moment(value.searchFromDateTime).format("MM-DD-YYYY"));
          availableSpot.ToDate = new Date(moment(value.searchToDateTime).format("MM-DD-YYYY"));
          availableSpot.FromTime = moment(value.searchFromDateTime).format("hh:mm:ss A");
          availableSpot.ToTime = moment(value.searchToDateTime).format("hh:mm:ss A");
          availableSpots.push(availableSpot);
        });


        let availablePlace = new AvailableSpotsRequest();
        availablePlace.PropertyGroupID = place.propertyGroupID;
        availablePlace.FromDate = new Date(moment(fromDate).format("MM-DD-YYYY"));
        availablePlace.ToDate = new Date(moment(toDate).format("MM-DD-YYYY"));
        availablePlace.FromTime = moment(fromDate).format("hh:mm:ss A");
        availablePlace.ToTime = moment(toDate).format("hh:mm:ss A");
        availableSpots.push(availablePlace);

        this.placesService.CheckForAvaliableSpots(availableSpots).subscribe((response) => {

          let spots: any[] = response.data;
          if (spots[spots.length - 1].isSpotAvaliable) {
            this.placesService.cartPropertyGroup.push(place);
            localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
            this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
            this.hideAddCartBtn = false;
          }
          else {
            this.commonService.openSnackBar('The Spot is not available.Please change the date and try again', null);
            this.hideAddCartBtn = false;
          }

        }, (error) => {
          this.hideAddCartBtn = false;
          console.log(error);

        });


      }

    }
    else {
      this.commonService.openSnackBar('Maximum 5 orders can be added to the cart bag', null);
    }

  }

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

  map: any;
  firstTimeLoad: boolean = true;
  // infowindow: any;
  markers: google.maps.Marker[] = [];

  initializeMap(lat, lon) {
    this.deleteMarkers();

    if (this.firstTimeLoad) {
      this.firstTimeLoad = false;

      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 10,
          center: new google.maps.LatLng(lat, lon),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      );


      this.image = {
        url:
          `${location.origin}/assets/images/map-marker-icon.png`,
        // This marker is 20 pixels wide by 32 pixels high.
        //  size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        // origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        //  anchor: new google.maps.Point(0, 32),
        // scaledSize: new google.maps.Size(32, 38),
        labelOrigin: new google.maps.Point(17, 15)

      };

      this.hover_image = {
        url: `${location.origin}/assets/images/map-marker-icon-hover.png`,
        labelOrigin: new google.maps.Point(17, 15)

      };
    }

    for (let i = 0; i < this.displayedPlaces.length; i++) {
      this.addMarker(this.displayedPlaces[i], i)
    }
    if (this.displayedPlaces.length > 0) {
      this.map.setCenter(this.markers[0].getPosition());
      this.map.setZoom(14);

    }
  }

  setMapOnAll(map) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  // Adds a marker to the map and push to the array.
  addMarker(place, i) {

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(place.latitude, place.longitude),
      map: this.map,

      // label: '$' + place.pricingAmount,
      label: {
        color: 'red',
        fontSize: Number(place.calculatedAmount) > 99 ? '8px' : '10px',
        fontWeight: '900',
        text: '$' + Number(place.calculatedAmount).toFixed()

      },
      icon: this.image,
      // shape: shape,
      zIndex: i + 1
    });

    google.maps.event.addListener(marker, 'click', ((marker, i) => {
      return () => {
        this.goToPlace(place);
      };
    })(marker, i));

    google.maps.event.addListener(marker, 'mouseover', ((marker, i) => {
      return () => {

        for (var j = 0; j < this.markers.length; j++) {
          this.markers[j].setIcon(this.image);
          this.markers[j].setZIndex(j + 1);
        }
        marker.setIcon(this.hover_image);
        marker.setZIndex(1000);
        let markerLabel = marker.getLabel();
        markerLabel.color = 'white'
        marker.setLabel(markerLabel);

      };
    })(marker, i));

    google.maps.event.addListener(marker, 'mouseout', ((marker, i) => {
      return () => {

        for (var j = 0; j < this.markers.length; j++) {
          this.markers[j].setIcon(this.image);
          this.markers[j].setZIndex(j + 1);
          let markerLabel = marker.getLabel();
          markerLabel.color = 'red'
          marker.setLabel(markerLabel);
        }
      };
    })(marker, i));

    this.markers.push(marker);

  }




  changeSelectedMarker(i: number, place: any): void {
    this.changeMarkerIcon();
    this.markers[i].setIcon(this.hover_image);
    this.markers[i].setZIndex(1000);
    let markerLabel = this.markers[i].getLabel();
    markerLabel.color = 'white'
    this.markers[i].setLabel(markerLabel);
    this.map.setZoom(14);
    this.map.setCenter(this.markers[i].getPosition());
  }

  // Sets the map on all markers in the array.
  changeMarkerIcon() {

    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setIcon(this.image);
      this.markers[i].setZIndex(i + 1);

      let markerLabel = this.markers[i].getLabel();
      markerLabel.color = 'red'
      this.markers[i].setLabel(markerLabel);
    }
  }

  onMapReady(map) {
    map.setOptions({
      zoomControl: 'true',
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    });
  }

  getAvailableSpots(place) {

    let fromDate = this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value;
    let toDate = this.dateForm.get(SEARCH_FORM_METADATA.toDate).value;

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = new Date(moment(fromDate).format("MM-DD-YYYY"));
    availableSpotsRequest.ToDate = new Date(moment(toDate).format("MM-DD-YYYY"));
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    var availablerequest = [];
    availablerequest.push(availableSpotsRequest);
    this.placesService.CheckForAvaliableSpots(availablerequest)
      .subscribe((response) => {

        if (response.data[0].isSpotAvaliable) {
          if (this.authenticationService.isAuthorized()) {
            this.addToCart(place, true);
          }
          else {
            this.hideAddCartBtn = false;

            this.placesService.cartPropertyGroup = [];

            this.placesService.cartPropertyGroup.push(place);

            localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

            this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

            this.router.navigate(['/cart', { reservenow: true }]);
          }

        }
        else {
          this.commonService.openSnackBar("Spot is not available.", null);
        }
      }, (error) => {
        this.commonService.openSnackBar(error, null);
      })
  }


  sort(sortMethod) {
    this.sortMethod = sortMethod;
    if (sortMethod == SortMethodEnum.cheapest) {
      this.displayedPlaces = sort(this.displayedPlaces).asc([(u) => u.calculatedAmount]);
    } else if (sortMethod == SortMethodEnum.closest) {
      this.displayedPlaces = sort(this.displayedPlaces).asc([
        (u) => u.distance,
      ]);
    }
    this.changeDetectorRef.detectChanges();
  }


  clickedMarker(label: string, index: number) {

    console.log(`clicked the marker: ${label || index}`);
    $('.scrollingevt').scrollTop(0);
    $('.bordorclass').removeClass('bordorclass');
    $('#showallclick').click();
    window.setTimeout(() => {
      $('.scrollingevt').scrollTop((($('#' + label).offset().top) - 120));
      $('#' + label).click();
      $('#' + label).addClass('bordorclass');


    }, 1000);
  }


  hideDeleteIcon: boolean = false;
  deletePlace(index: number) {
    window.gtag_report_conversion(window.location.href);

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
      this.hideDeleteIcon = false;
    }

  }

  searchBtnDisabled: boolean = false;
  search() {
debugger;
    this.deleteMarkers();
    window.gtag_report_conversion(window.location.href);

    this.searchBtnDisabled = true;
    this.sortMethod = null;
    const vehicleLength = this.searchForm.get(
      SEARCH_FORM_METADATA.vehicleLength
    ).value;
    if (this.currentLocation.lng && this.currentLocation.lat) {

      this.httpError = null;
      if(jQuery('#datetimepicker').val()!="" && jQuery('#todatetimepicker').val()!="")
      {
        this.dateForm = this.formBuilder.group({
          [SEARCH_FORM_METADATA.fromDate]: [jQuery('#datetimepicker').val()],
          [SEARCH_FORM_METADATA.toDate]: [jQuery('#todatetimepicker').val()],
          [SEARCH_FORM_METADATA.sort]: ['']
        });
      }
      let fromDate = this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value;
      let toDate = this.dateForm.get(SEARCH_FORM_METADATA.toDate).value;

      let searchRequest = new SearchRequest();
      let searchFilter = <string>this.searchForm
        .get(SEARCH_FORM_METADATA.searchBar)
        .value;

      // searchFilter = searchFilter?.split(',')[0];

      if (this.searchAddress.street_number) {
        searchRequest.SearchFilterStreet = this.searchAddress.street_number;
      }
      if (this.searchAddress.locality) {
        searchRequest.SearchFilterCity = this.searchAddress.locality;
      }
      if (this.searchAddress.state) {
        searchRequest.SearchFilterState = this.searchAddress.state;
      }

      searchRequest.Latitude = +this.currentLocation.lat;
      searchRequest.Longititude = +this.currentLocation.lng;

      searchRequest.FromDate = new Date(convertIntoDate(fromDate));
      searchRequest.ToDate = new Date(convertIntoDate(toDate));
      searchRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
      searchRequest.ToTime = moment(toDate).format("hh:mm:ss A");
      searchRequest.VehicleLength = Number(vehicleLength);

      this.searchService.fromDate = this.dateForm.get(
        SEARCH_FORM_METADATA.fromDate
      ).value;
      this.searchService.toDate = this.dateForm.get(
        SEARCH_FORM_METADATA.toDate
      ).value;
      this.displayedPlaces = [];
      this.hideExtra = false;

      if (this.selectedMode == Mode.City_Parking) {

        this.placesService.getSearchResultForAuto(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });

      }
      else if (this.selectedMode == Mode.Boat) {
        this.placesService.GetSearchResultforBoats(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);

          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }
      else if (this.selectedMode == Mode.Helicopter) {
        this.placesService.GetSearchResultforHelicopter(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }
      else if (this.selectedMode == Mode.Seaplane) {

        this.placesService.GetSearchResultforSeaPlanes(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }
      else if (this.selectedMode == Mode.Airport_Parking) {

        this.placesService.GetSearchResultforAirPort(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }

      else if (this.selectedMode == Mode.Semi_Truck) {

        this.placesService.GetSearchResultforSemiTruck(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }
      else if (this.selectedMode == Mode.Truck_And_Trailer) {

        this.placesService.GetSearchResultforTruckAndTrailer(searchRequest)
          .subscribe((response) => {
            this.setplaces(response);
          }, (error) => {
            this.displayedPlaces = [];
            this.places = [];
            this.httpError = error;
            this.searchBtnDisabled = false;
          });
      }


    }
  }


  setplaces(response) {
    this.searchBtnDisabled = false;
    this.places = response.data;
    console.log(this.places);

    // const vehicleCategory = Object.keys(this.vehicleCategoryEnum);

    let searchDetails: any[] = [];

    this.places.forEach((val) => {
      if (val.vehicleCategoryID == this.vehicleCategoryEnum[this.selectedMode]) {
        searchDetails.push(val);
      }
    })

    this.places.forEach((val) => {
      if (val.vehicleCategoryID != this.vehicleCategoryEnum[this.selectedMode]) {
        searchDetails.push(val);
      }
    })
    this.places = searchDetails;

    // this.places.sort(function (a, b) {
    //   return a.distance - b.distance;
    // });

    this.displayedPlaces = this.places.filter(s => s.distance < 25);
    if (this.places.length >= 20) {
      this.displayedPlaces = this.places.slice(0, 20);
      this.hideExtra = true;
      this.placesCount = this.places.length - this.displayedPlaces.length;
    }
    else if (this.displayedPlaces.length == 0) {
      this.displayedPlaces = this.places;
    }
    else if (this.places.length > this.displayedPlaces.length) {
      this.placesCount = this.places.length - this.displayedPlaces.length;
      this.hideExtra = true;
    }
    else {
      this.hideExtra = false;
    }

    this.placesLoaded = true;
    this.changeDetectorRef.detectChanges();
    if (this.displayedPlaces.length > 0) {
      this.initializeMap(this.displayedPlaces[0].latitude, this.displayedPlaces[0].longitude);
    }


  }

  showAllPlaces() {
    this.hideExtra = false;
    this.displayedPlaces = this.places;
    this.changeDetectorRef.detectChanges();
    this.initializeMap(this.displayedPlaces[0].latitude, this.displayedPlaces[0].longitude);
  }

  // goToPlace1(propertyGroupID){
  //   const options = {
  //     title: 'Updated',
  //     message: 'Vehicle Details Updated Successfully!',
  //     confirmText: 'OK'
  //   };
  //   // this.dialogref.open(options);
  //   const dialogRef = this.dialog.open(DetailsPageComponent, {
  //     width: '100%'
  //   });
  // }

  goToPlace(place) {
    // 

    // let fromDate = this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value;
    // let toDate = this.dateForm.get(SEARCH_FORM_METADATA.toDate).value;

    // let detailsRequest: any = {};
    // let searchFilter = <string>this.searchForm
    //   .get(SEARCH_FORM_METADATA.searchBar)
    //   .value;

    // if (this.searchAddress.street_number) {
    //   detailsRequest.searchfilterstreet = this.searchAddress.street_number;
    // }
    // if (this.searchAddress.locality) {
    //   detailsRequest.searchfiltercity = this.searchAddress.locality;
    // }
    // if (this.searchAddress.vehiclelength) {
    //   detailsRequest.vehiclelength = this.searchAddress.vehiclelength;
    // }

    // detailsRequest.latitude = +this.currentLocation.lat;
    // detailsRequest.longititude = +this.currentLocation.lng;
    // detailsRequest.fromdate = moment(fromDate).format("YYYY-MM-DD HH:mm:ss");
    // detailsRequest.todate = moment(toDate).format("YYYY-MM-DD HH:mm:ss");

    // detailsRequest.parkingcategory = this.selectedMode;
    // detailsRequest.propertyGroupID = propertyGroupID;
    // detailsRequest.id = propertyGroupID;


    const dialogRef = this.dialog.open(DetailsPageComponent, {
      autoFocus: false,
      maxWidth: '500px',
      width: this.getWidth(),
      data: place,
      position: this.getPosition(),
    });

    // this.router.navigateByUrl(`/details/${propertyGroupID}`);

    // // Use id instead of index as this array is being filtered
    // this.searchService.fromDate = this.dateForm.get(
    //   SEARCH_FORM_METADATA.fromDate
    // ).value;
    // this.searchService.toDate = this.dateForm.get(
    //   SEARCH_FORM_METADATA.toDate
    // ).value;
    // this.searchService.selectedPlace = this.places.find((place) => {
    //   return place.id === id;
    // });
    // let name = encodeURI(this.searchService.selectedPlace.name)
    //   .replace('(', '%28')
    //   .replace('!', '%21')
    //   .replace("'", '%27')
    //   .replace('*', '%2A')
    //   .replace('~', '%7E');
    // this.ngZone.run(() => {
    //   this.router.navigateByUrl(
    //     `/details/${this.searchService.selectedPlace.id}/${name}`
    //   );
    // });
  }

  filterPlacesByDate() {
    if (this.places) {
      this.displayedPlaces = this.places.filter((place) => {
        // console.log('place.fromDate', moment(place.fromDate));
        // console.log('place.toDate', moment(place.toDate));
        // console.log('dateForm.fromDate', moment(this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value));
        // console.log('dateForm.toDate', moment(this.dateForm.get(SEARCH_FORM_METADATA.toDate).value));
        // console.log('from comparison', moment(place.fromDate).isBefore(moment(this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value)));
        // console.log('to comparison', moment(place.toDate).isAfter(moment(this.dateForm.get(SEARCH_FORM_METADATA.toDate).value)));
        if (
          moment(place.fromDate).isBefore(
            moment(this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value)
          ) &&
          moment(place.toDate).isAfter(
            moment(this.dateForm.get(SEARCH_FORM_METADATA.toDate).value)
          )
        ) {
          return place;
        }
      });
      if (this.hideExtra) {
        this.displayedPlaces = this.displayedPlaces.slice(0, 10);
      }
      // console.log('places filtered');
    }
  }

  // scroll() {
  //   jQuery(window).scroll(function () { fheight = jQuery('footer').height() + 50; if (jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - fheight) { angularcallbackfunction() } });
  // }

}

