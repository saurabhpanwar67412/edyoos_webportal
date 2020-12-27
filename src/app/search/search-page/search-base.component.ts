import { MapsAPILoader } from '@agm/core';

export abstract class SearchBaseComponent {
  currentLocation: google.maps.LatLngLiteral;
  geoCoder;

  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name'
  };

  constructor(protected mapsAPILoader: MapsAPILoader) { }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      // 35.7021051,139.7750452 Akihabara
      // 47.59948195707674, -122.30985900179657 somewhere in USA
      // 30.0443567,31.2356568 Tahrir Square
      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.getAddress(this.currentLocation);
    });
  }

  getAddress(address: google.maps.LatLngLiteral) {
    this.geoCoder.geocode(
      { location: { lat: address.lat, lng: address.lng } },
      (results, status) => {

        console.log(results);
        console.log(status);

        if (status === 'OK') {
          if (results[0]) {
            // debugger
            let address: any = {};
            // if(results[0].address_components[2].short_name)
            // address=results[0].address_components[2].short_name;
            // if(results[0].address_components[2].short_name)

            for (var i = 0; i < results[0].address_components.length; i++) {
              
              var addressType = results[0].address_components[i].types[0];
              if (this.componentForm[addressType]) {
                var val = results[0].address_components[i][this.componentForm[addressType]];

                if (addressType == 'street_number' || addressType == 'route') {
                  address.street_number = val;
                }
                else if (addressType == 'locality') {
                  // address.locality=address+','+val;
                  address.locality = val;
                }
                else if (addressType == 'administrative_area_level_1') {
                  // address=address+','+val;
                  address.administrative_area_level_1 = val;
                }

                else if (addressType == 'country') {
                  // address.country=address+','+val;
                  address.country = val;
                }
              }
            }

            this.assignAddress(address);
            // this.searchForm.updateValueAndValidity();
          }
        }
      }
    );
  }

  abstract assignAddress(address);
}
