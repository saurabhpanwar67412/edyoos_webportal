import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlacesService } from '../shared/places.service';
import { UserService } from '../shared/user.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';

@Component({
  selector: 'app-user-nav-bar',
  templateUrl: './user-nav-bar.component.html',
  styleUrls: ['./user-nav-bar.component.scss']
})
export class UserNavBarComponent implements OnInit {

  ordersCount:number=0;
  cartPropertyGroup:any[]=this.placesService.cartPropertyGroup;
  collapsed = true;
  isLoggedIn;
  cartTopStyle = '-1503px';

  constructor(
    public router: Router,
    private placesService: PlacesService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) { }

  

  ngOnInit(): void {
    if(this.authenticationService.userValue){
      this.isLoggedIn = true;
    }
    else{
      this.isLoggedIn = false;
    }
    
    // if (localStorage.getItem('userData')) {
    //   this.isLoggedIn = true;
    // }

    this.ordersCount = this.placesService.cartPropertyGroup.length;
    this.placesService.addedCartPropertyGroup.subscribe((value:any[]) => {
      this.ordersCount = value.length;
      this.cartPropertyGroup=value;
      if(this.ordersCount==0){
        this.cartTopStyle = '-1503px';
      }
      console.log(value);
      
    });

    

    this.authenticationService.user.subscribe((user) => {
     if(user){
      this.isLoggedIn = true;
     }
     else{
      this.isLoggedIn = false;
     }
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  openCartDetails() {
    if (this.cartTopStyle == '53px') {
      this.cartTopStyle = '-1503px'
    }
    else {
      this.cartTopStyle = '53px'
    }
  }

  goToPlace(propertyGroup:any) {
    console.log(propertyGroup);

        let detailsRequest:any={};

        detailsRequest.searchfilter = propertyGroup.city;
        detailsRequest.latitude = propertyGroup.latitude;
        detailsRequest.longititude = propertyGroup.longitude;
        detailsRequest.fromdate = propertyGroup.fromDate;
        detailsRequest.todate = propertyGroup.toDate;
        detailsRequest.fromtime = new Date(propertyGroup.fromDate).toLocaleTimeString();
        detailsRequest.totime = new Date(propertyGroup.todate).toLocaleTimeString();
        detailsRequest.parkingcategory='auto';
        this.router.navigate([`/details/${propertyGroup.propertyGroupID}`, detailsRequest]);
  }

  deletePlace(index:number){
    this.placesService.cartPropertyGroup.splice(index,1);

    localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

    this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
  }

  signOut() {

   this.authenticationService.logout();
  }
}

