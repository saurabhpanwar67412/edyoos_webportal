import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
import { BookingModel } from '../model/Booking/booking.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getOrderById(id:number):Observable<ApiResponse<BookingModel[]>>
  {
    return this.http.get<ApiResponse<BookingModel[]>>(`${apiRoutes.booking.getallBookingById}?userID=${id}`);
  }

  getOrders() {
    // TODO: create BE call for my orders
    return of([
      {
        name: "Porky's Restaurant, Marathon",
        referenceNumber: "3258ASWDF4J3T6",
        fromDate: "2020-06-27T08:15:00",
        toDate: "2020-06-27T11:45:00",
        status: "Completed",
        price: 10,
        type: "VIP Parking"
      },
      {
        name: "Food Market, Phoenix",
        referenceNumber: "176FHS4J3XT6",
        fromDate: "2020-08-12T23:15:00",
        toDate: "2020-08-13T02:00:00",
        status: "Completed",
        price: 3,
        type: "Outdoor Parking"
      }
    ])
  }
}
