import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PlacesService } from 'src/app/shared/places.service';

@Component({
  selector: 'app-date-validation',
  templateUrl: './date-validation.component.html',
  styleUrls: ['./date-validation.component.scss']
})
export class DateValidationComponent implements OnInit {
  cartPropertyGroupDetails: any[];

  constructor(private placeService:PlacesService) { }

  ngOnInit(): void {
    this.cartPropertyGroupDetails=this.placeService.cartPropertyGroup.filter(s => moment(s.searchFromDateTime).isSameOrBefore(new Date()));
    
    this.cartPropertyGroupDetails.forEach((value,index)=>{
      value.showDateError=true;
    });
  }

}
