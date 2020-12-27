import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { Mode, SEARCH_FROM_METADATA } from './main.component.metadata';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/shared/search.service';
import { SearchBaseComponent } from 'src/app/search/search-page/search-base.component';
import { PlacesService } from 'src/app/shared/places.service';
import { Meta } from '@angular/platform-browser';
declare var window:any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends SearchBaseComponent
  implements OnInit, AfterViewInit {
  displayLength;
  modePlaceholder;
  // vehicleLength
  Mode = Mode;
  // autocomplete;
  // geoCoder;
  // searchResult;
  searchForm: FormGroup;
  SEARCH_FROM_METADATA = SEARCH_FROM_METADATA;

  @ViewChild('searchBar')
  public searchElementRef: ElementRef;

  constructor(
    public router: Router,
    private http: HttpClient,
    protected mapsAPILoader: MapsAPILoader,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private ngZone: NgZone,
    private placeService: PlacesService,
    private metaTagService: Meta
  ) {
    super(mapsAPILoader);
  }

  ngOnInit(): void {
    this.createForm();
    this.placeService.vehicleCategory.subscribe((data: Mode) => {
      this.searchForm.get(SEARCH_FROM_METADATA.vehicleCategory).setValue(data);
    });
    // this.searchForm.get(SEARCH_FROM_METADATA.vehicleCategory).setValue(Mode.City_Parking);
    // this.changeSearchMode(Mode.City_Parking);

    this.metaTagService.updateTag(
      { name: 'title', content: 'Edyoos | Easy Online Parking Reservations' }
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Edyoos is the easiest way to reserve parking for all your travels. Reserve '
      + 'city parking, airport parking, truck &amp; trailer parking, and more. Pay online and find your spot with '
      + 'real-time tracking.' }
    );

    this.metaTagService.updateTag(
      { name: 'keywords', content: 'parking, parking reservations, reserved parking, parking services, airport parking' }
    );

  }

  ngAfterViewInit() {
    this.initializeAutoComplete();
  }

  //   getVehicleCategoryEnum() : Array<string> {
  //     var keys = Object.keys(this.Mode);
  //     return keys;
  // }
  createForm() {
    this.searchForm = this.formBuilder.group({
      [SEARCH_FROM_METADATA.searchBar]: ['', [Validators.required]],
      [SEARCH_FROM_METADATA.vehicleCategory]: [null, [Validators.required]],
      [SEARCH_FROM_METADATA.vehicleLength]: ['']
    });
  }

  initializeAutoComplete() {

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
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
          this.searchForm
            .get(SEARCH_FROM_METADATA.searchBar)
            .patchValue(place.formatted_address);

          this.currentLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

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
      // this function calls assignAddressInternally
      // this.getCurrentPosition();
      // this.setCurrentLocation();
    });
  }

  getGeoLocation(){
    this.getCurrentPosition();
      this.setCurrentLocation();
  }

  setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.geoCoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if(status === "OK") {
            let address = results[results.length - 3].formatted_address;
            this.searchForm.get(SEARCH_FROM_METADATA.searchBar).setValue(address);
            localStorage.setItem("currentAddress", results[0].formatted_address)
          }
        });
    });
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
    //   .get(SEARCH_FROM_METADATA.searchBar)
    //   .patchValue(formatedAddress);
  }


  changeSearchMode(mode) {

    if (mode == Mode.Boat || mode == Mode.Seaplane) {
      this.displayLength = true;
      this.modePlaceholder = mode;

      this.searchForm.get(SEARCH_FROM_METADATA.vehicleLength).setValidators(Validators.required);
      this.searchForm.get(SEARCH_FROM_METADATA.vehicleLength).updateValueAndValidity();

    } else {
      this.displayLength = false;

      this.searchForm.get(SEARCH_FROM_METADATA.vehicleLength).clearValidators();
      this.searchForm.get(SEARCH_FROM_METADATA.vehicleLength).updateValueAndValidity();
    }

  }

  // isSelected(mode) {
  //   if (mode == this.selectedMode) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // onSearchChange(e) {
  // debugger
  // keyword = 'new'
  // e.target.value = this.searchResults;
  // }

  search() {

    window.gtag_report_conversion(window.location.href);

    this.searchService.searchText = this.searchForm.get(
      SEARCH_FROM_METADATA.searchBar
    ).value;

    if (this.currentLocation && this.currentLocation.lat) {
      const vehicleLength = this.searchForm.get(
        SEARCH_FROM_METADATA.vehicleLength
      ).value;

      let search: any = {};
      search.lat = this.currentLocation.lat;
      search.lng = this.currentLocation.lng;
      search.mode = this.searchForm.get(SEARCH_FROM_METADATA.vehicleCategory).value;
      if (this.searchAddress.street_number)
        search.street = this.searchAddress.street_number;
      if (this.searchAddress.locality)
        search.locality = this.searchAddress.locality;
      if(this.searchAddress.state)
      search.state = this.searchAddress.state;

      search.search = this.searchService.searchText;

      if (vehicleLength) {
        search.vehiclelength = vehicleLength;
        this.router.navigate(['/search', search]);

        // this.router.navigateByUrl(
        //   `/search?lat=${this.currentLocation.lat}&lng=${this.currentLocation.lng}&mode=${this.selectedMode}&length=${vehicleLength}&searchfilter=${this.searchService.searchText}`
        // );
      } else {
        this.router.navigate(['/search', search]);

        // this.router.navigateByUrl(
        //   `/search?lat=${this.currentLocation.lat}&lng=${this.currentLocation.lng}
        //   &mode=${this.selectedMode}&street=${this.searchAddress.street_number}
        //   &locality=${this.searchAddress.locality}&search=${this.searchAddress.administrative_area_level_1},${this.searchAddress.country}`
        // );
      }
    } else {
      this.router.navigateByUrl(`/search`);
    }

  }
}
