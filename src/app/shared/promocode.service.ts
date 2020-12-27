import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
import { PromocodeRequest } from '../model/cart/promocode_request.model';


@Injectable({
  providedIn: 'root'
})
export class PromocodeService {

  constructor(private http: HttpClient) {
  }

  getPromoCodeDiscountPercent(promocode:any){
    return this.http.post<ApiResponse<any>>(`${apiRoutes.PromoCode.GetPromoCodeDiscountPercent}?promocode=${promocode}`, null);
  }

}
