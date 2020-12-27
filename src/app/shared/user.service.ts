import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
import { BookingModel } from '../model/Booking/booking.model';
import { UserProfile } from '../model/UserProfile/UserProfile.model';
import { CRUDApiResponseModel } from '../model/crud_apiresponse.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userStatusChanged: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  userLogin(params) {
    // return  this.http.post(`${environment.basePath}login`, params);
    return of({ username: 'user 1' });
  }

  getCards() {
    // TODO: call BE service to get card info of customers
    return of([
      { name: 'Master', number: 'xxxxx3532' },
      { name: 'Visa', number: 'xxxxx0972' }
    ]).pipe(delay(2000));
  }

  EmailUs(body) {
    return this.http.post<ApiResponse<CRUDApiResponseModel>>(`${apiRoutes.login.sendCustomerFeedBackMail}`, body);
  }

  changePassword(body) {

    return this.http.post<ApiResponse<CRUDApiResponseModel>>(`${apiRoutes.login.changePassword}`, body);
  }

  getuserprofile(id) {
    return this.http.get<ApiResponse<any[]>>(`${apiRoutes.userprofile.getuserprofile}?userID=${id}`);
  }

  updateProfile(body: FormData) {
    return this.http.post<ApiResponse<CRUDApiResponseModel>>(`${apiRoutes.userprofile.updateUserProfileDetails}`, body);
    //return of(true);
  }
  savevehicle(body) {
    return this.http.post<ApiResponse<CRUDApiResponseModel>>(`${apiRoutes.userprofile.addvehciledetails}`, body);
    //return of(true);
  }
  getVehicleDetails(userID: number) {
    return this.http.post<ApiResponse<any>>(`${apiRoutes.userprofile.getVehicleDetails}?userID=${userID}`, null);
  }
  deleteVehicleDetails(vehicleID:number){
    return this.http.post<ApiResponse<any>>(`${apiRoutes.userprofile.deleteVehicleDetails}?vehicleID=${vehicleID}`, null);
  }

  isAuthenticated() {
    return !!localStorage.getItem('edyoosUserDetails')
  }
}
