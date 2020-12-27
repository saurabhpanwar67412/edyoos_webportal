import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/shared/places.service';
import { Mode } from '../main/main.component.metadata';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.scss']
})
export class WhyUsComponent implements OnInit {
  vehicleCategory = Mode;

  constructor(private placeService: PlacesService, private router: Router) { }

  ngOnInit(): void {
  }

  navigatetoTop(category: Mode) {
    let url: string;
    if (category == Mode.City_Parking) {
      url = '/pages/city-parking';
    }
    else if(category == Mode.Helicopter){
      url = '/pages/helicopter-parking';
    }
    else if(category == Mode.Seaplane){
      url = '/pages/seaplane-parking';
    }
    else if(category == Mode.Semi_Truck){
      url = '/pages/semi-truck-parking';
    }
    else if(category == Mode.Truck_And_Trailer){
      url = '/pages/truck-parking';
    }
    else if(category == Mode.Airport_Parking){
      url = '/pages/airport-parking';
    }
    else if(category == Mode.Boat){
      url = '/pages/boat-parking';
    }
    this.router.navigate([url]);

    // window.scrollTo(0, 0);
    // this.placeService.vehicleCategory.next(category);
  }

}
