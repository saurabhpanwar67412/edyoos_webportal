import { Component, OnInit } from '@angular/core';
import { IPlace } from 'src/app/shared/place';
import { PlacesService } from 'src/app/shared/places.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CartService } from 'src/app/shared/cart.service';
import { FeeType } from 'src/app/shared/enum/feetype.enum';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  bookedPlaces: any[];
  total = 0;
  constructor(private placesService: PlacesService, private authenticationService: AuthenticationService, private cartService: CartService) { }
  hidediv: boolean=true;
  promoCodeDiscountPercentage: number = 0;
  promoCodeDiscountAmount: number;

  ngOnInit(): void {
    this.bookedPlaces = this.placesService.cartPropertyGroup;

    this.calculateTotal();
    this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {

      this.bookedPlaces = value;
      this.calculateTotal();
    });

    this.placesService.promocodeDiscountPercentage.subscribe((response) => {
      console.log(response);

      this.promoCodeDiscountPercentage = <number>response;
      this.calculateTotal();

    }, (error) => {
      console.log(error);

    })
  }

  openNewWindow() {
    window.open('#/privacy',
      'newwindow',
      'width=500,height=500,top=' + ((window.innerHeight - 500) / 2) + ', left=' + ((window.innerWidth - 700) / 2));
  }


  checkOutAmount: number = 0;
  additionalFeeCount: number = 0;
  additionalFeeAmount: number = 0;

  calculateTotal() {
    this.checkOutAmount = 0;
    this.additionalFeeAmount = 0;
    this.bookedPlaces.forEach((place) => {
      this.checkOutAmount += parseFloat(place.checkoutAmount);
    });

    if (this.promoCodeDiscountPercentage != 0) {
      this.promoCodeDiscountAmount = this.checkOutAmount * (this.promoCodeDiscountPercentage / 100);
      this.total = this.checkOutAmount - this.promoCodeDiscountAmount;
    }
    else {
      this.total = this.checkOutAmount;
    }

    let totalFeeAmount: number = 0;
    this.additionalFeeCount = 0;
    this.bookedPlaces.forEach((place) => {
      if (place.fees) {
        this.additionalFeeCount += 1;
        totalFeeAmount += this.feeAmountCalculate(place.fees, place.checkoutAmount);
      }
    });
    this.total += totalFeeAmount;
    this.additionalFeeAmount = totalFeeAmount;
  }

  feeAmountCalculate(extraFees: any[], groupCheckOutAmount: number) {
    let extraAmount: number = 0;
    extraFees.forEach((value, index) => {
      if (value.feeType == FeeType.Percent) {
        extraAmount += groupCheckOutAmount * (value.feeAmount / 100);
      }
      else if (value.feeType == FeeType.Dollor) {
        extraAmount += value.feeAmount;
      }

    });

    return extraAmount;
  }

  hideRemoveCartItemBtn: boolean = false;

  removeItem(index) {
    this.hideRemoveCartItemBtn = true;
    if (this.authenticationService.isAuthorized()) {
      this.cartService.deleteCart(this.placesService.cartPropertyGroup[index].cartID).
        subscribe((response) => {

          this.placesService.cartPropertyGroup.splice(index, 1);
          localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

          this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

          this.bookedPlaces = this.placesService.cartPropertyGroup;
          this.calculateTotal();
          this.hideRemoveCartItemBtn = false;
        }, (error) => {
          this.hideRemoveCartItemBtn = false;
          console.log(error);

        })
    }
    else {
      this.placesService.cartPropertyGroup.splice(index, 1);

      localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

      this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
      this.bookedPlaces = this.placesService.cartPropertyGroup;
      this.calculateTotal();
    }
  }
  openPrivacyNewWindow() {
    window.open('#/privacy',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
  openTermsNewWindow() {
    window.open('#/terms-and-conditions',
      '_blank',
      'width=500,height=500,top=' + 0 + ', left=' + 0);
  }
  hidedivpanel()
  {
    this.hidediv=!this.hidediv;
  }
}
