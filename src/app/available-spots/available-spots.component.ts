import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../shared/places.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-available-spots',
  templateUrl: './available-spots.component.html',
  styleUrls: ['./available-spots.component.scss']
})
export class AvailableSpotsComponent implements OnInit {

  constructor(private placesService:PlacesService,public dialogRef: MatDialogRef<AvailableSpotsComponent>) { }

  cartPropertyGroupDetails:any[]=[];
  disableOkBtn:boolean=false;

  ngOnInit(): void {
    this.cartPropertyGroupDetails=this.placesService.cartPropertyGroup;
    
    
    this.disableOkBtn=(this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == true).length==0);
  }

}
