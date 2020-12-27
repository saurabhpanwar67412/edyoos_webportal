import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart/cart.model';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
import { BookingRequest } from '../model/cart/booking_request.model';
import { CardSetupRequest } from '../model/payment/card_setup_request.model';
import { AttachPaymentRequest } from '../model/payment/attach_payment_request.model';
import { UpdatePaymentRequest } from '../model/payment/update_payment_request.model';
import { ChargeCustomer } from '../model/payment/charge_customer.model';
import { RefundRequest } from '../model/payment/refund_request.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  createPaymentIntent(purchase: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(apiRoutes.payment.createPaymentIntent, purchase);
  }

  GetPaymentMethodsById() {
    return this.http.get<ApiResponse<any>>(`${apiRoutes.payment.GetPaymentMethodsById}`);
  }

  getPublishableKey() {
    return this.http.get<ApiResponse<any>>(`${apiRoutes.payment.getPublishableKey}`);
  }

  chargeCustomerByPaymentId(chargeCustomer:ChargeCustomer) {
    return this.http.post<ApiResponse<any>>(apiRoutes.payment.chargeCustomerByPaymentId, chargeCustomer);
  }

  addBookingDetails(bookingRequest:BookingRequest) {
    return this.http.post<ApiResponse<any>>(apiRoutes.booking.addBookingDetails, bookingRequest);
  }
  getBookingDetailsById(bookingID: number) {
    return this.http.get<ApiResponse<any>>(`${apiRoutes.booking.getOrderDetailsById}?bookingID=${bookingID}`);
  }

  cardPaymentIntent(cardSetupRequest:CardSetupRequest){
    return this.http.post<ApiResponse<any>>(apiRoutes.payment.cardSetup, cardSetupRequest);
  }

  saveCardDetails(attachPaymentRequest:AttachPaymentRequest){
    return this.http.post<ApiResponse<any>>(apiRoutes.payment.saveCard, attachPaymentRequest);
  }

  updatePaymentDetails(updatePaymentRequest:UpdatePaymentRequest){
    return this.http.post<ApiResponse<any>>(apiRoutes.payment.updatePaymentDetails, updatePaymentRequest);
  }

  deletePaymentCardDetails(cardId:number){
    return this.http.post<ApiResponse<any>>(`${apiRoutes.booking.deletePaymentCardDetails}?cardId=${cardId}`, null);
  }
  raiseRefundRequest(refundRequest:RefundRequest){
    return this.http.post<ApiResponse<any>>(`${apiRoutes.payment.refundPayment}`, refundRequest);
  }

}
