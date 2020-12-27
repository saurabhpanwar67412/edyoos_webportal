import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AvailableSpotsComponent } from '../available-spots/available-spots.component';
import { AvailableSpotsRequest } from '../model/Booking/available_spots.model';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { CartService } from '../shared/cart.service';
import { CommonService } from '../shared/common.service ';
import { PlacesService } from '../shared/places.service';


@Component({
    selector: 'app-nav-bar-new',
    templateUrl: './navbar-new.component.html',
    styleUrls: ['./navbar-new.component.scss'],
})
export class NavBarNewComponent implements OnInit {
    isLoggedIn: boolean;
    showCartMenu: boolean = true;
    showCartIcon: boolean = true;
    cartTopStyle = '-1503px';
    ordersCount: number = 0;
    cartPropertyGroup: any[] = this.placesService.cartPropertyGroup;
    total: number;
    public navbarCollapsed = true;
    @ViewChild("cartDivElement") cartDivElement: ElementRef;
    @ViewChild("bagIconElement") bagIconElement: ElementRef;
    @ViewChild("deleteIconElement") deleteIconElement: ElementRef;
    showCartSpinner: boolean;
    spotNotAvailableErrorMessage = this.cartService.cartSpotNotAvailableText;

    constructor(private authenticationService: AuthenticationService, private apiloader: MapsAPILoader, public router: Router
        , private cartService: CartService, private placesService: PlacesService
        , public commonService: CommonService, public dialog: MatDialog) { }
    ngOnInit(): void {
        if (this.authenticationService.isAuthorized()) {
            this.isLoggedIn = true;
            this.getCartDetails();
        }
        else {
            this.isLoggedIn = false;
            this.ordersCount = this.placesService.cartPropertyGroup.length;
            this.calculateTotal();
        }

        this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {
            this.ordersCount = value.length;
            this.cartPropertyGroup = value;
            this.calculateTotal();
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
    showSection = false;
    showSectionpartner = false;

    signOut() {
        this.authenticationService.logout();
    }

    calculateTotal() {
        this.total = 0;
        this.cartPropertyGroup.forEach((place) => {
            this.total += parseFloat(place.calculatedAmount);
        });

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

    openCartDetails() {

        if (this.showCartIcon && this.showCartMenu) {
            if (this.cartTopStyle == '63px') {
                this.cartTopStyle = '-1503px'
            }
            else {
                this.cartTopStyle = '63px';
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

    @HostListener('document:click', ['$event'])
    clickout(event) {

        if (this.cartDivElement.nativeElement.contains(event.target)) {
            this.cartTopStyle == '63px'
        }
        else if (this.bagIconElement.nativeElement.contains(event.target)) {

        }
        else if (this.deleteIconElement && this.deleteIconElement.nativeElement.contains(event.target)) {

        }
        else {
            this.cartTopStyle = '-1503px';
        }
    }

    reserveNow() {
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
            this.hideDeleteIcon = false;
        }

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
                    this.showCartSpinner = false;
                }
                // else {
                //     var notAvailableSpots = this.placesService.cartPropertyGroup.filter(s => s.isSpotAvaliable == false);
                //     if (notAvailableSpots.length > 0) {

                //         this.openDialog();
                //     }
                //     else {
                //         this.router.navigate(['/cart']);
                //     }
                // }

            }, (error) => {
                this.showCartSpinner = false;
                console.log(error);
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
}
