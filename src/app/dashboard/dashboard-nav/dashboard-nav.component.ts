import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DASHBOARD_TABS_METADATA, DASHBOARD_DROPDOWN_METADATA } from '../dashboard_metadata';
import {HttpClient} from '@angular/common/http';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { SEARCH_FROM_METADATA } from 'src/app/landing/main/main.component.metadata';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {

  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA
  username:string;
  summaries: any[];
  lat:any;
  lng:any;
  getAddress:any[];
  currentaddress:string;
  cityname:any[];
  countryname:any[];
  statename:any[];
  isOpen = false;
  private taskmenu = DASHBOARD_DROPDOWN_METADATA;
  @ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;
  constructor(private apiloader:MapsAPILoader, public router: Router,private ref: ChangeDetectorRef)
  {

  }
  get(){
   

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.getAddress=(this.lat,this.lng)
        console.log(position);
        localStorage.setItem("latandlong",this.lat+","+this.lng)
  
        this.apiloader.load().then(() => {
          let geocoder = new google.maps.Geocoder;
          let latlng = {lat: this.lat, lng: this.lng};
          var self=this;
          geocoder.geocode({'location': latlng}, function(results) {
              if (results[0]) {
                  self.currentaddress=results[0].formatted_address;
                  self.ref.detectChanges();
                  let city;
                  let country;
                  let state;
             for (var i=0; i<results[0].address_components.length; i++) {
              for (var b=0;b<results[0].address_components[i].types.length;b++) {
                  if (results[0].address_components[i].types[b] == "locality") {
                     state=results[0].address_components[i].long_name;
                      self.statename=state;
                      break;
                  }
                  if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    city=results[0].address_components[i].long_name;
                    self.cityname=city;
                    break;
                }
                if (results[0].address_components[i].types[b] == "country") {
                  country=results[0].address_components[i].long_name;
                  self.countryname=country;
                  break;
              }
                
              }
          }
              } else {
                console.log('Not found');
              }
          });
        });
       
  
      }
    })
  }
  
  }

  @Input()
  public set items(items:any) 
  {

    this.currentaddress = items;
  }
  
  ngOnInit(): void {

   this.get();
    this.getusername();
    this.summaries=Object.keys(this.taskmenu);
  }

  getusername() {
    var userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    this.username = userdetails.firstName+" "+userdetails.lastName;
  }
  filterForevents(val) {
    let search: any = {}; 
    search.lat = this.lat;
      search.lng = this.lng;
      search.mode = val;
      search.locality=this.cityname;
      search.search=this.statename+", "+this.cityname+", "+this.countryname;
      const vehicleLength = SEARCH_FROM_METADATA.vehicleLength
    search.vehiclelength=vehicleLength;
        this.router.navigate(['/search',search]);

  }

}
