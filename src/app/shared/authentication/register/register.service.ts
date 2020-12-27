import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { apiRoutes } from 'src/app/shared/routes/apiroutes';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { UserRegister } from 'src/app/model/register/register.model';
import { EmailConfirm } from 'src/app/model/emailconfirm/emailconfirm.model';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  RegisterUser(userRegister:UserRegister):Observable<ApiResponse<string>>{
 
    return this.http.post<ApiResponse<string>>(apiRoutes.register.userRegister,userRegister);
  }
  EmailConfirmation(emailConfirm:EmailConfirm):Observable<ApiResponse<string>>{
    return this.http.post<ApiResponse<string>>(apiRoutes.register.emailConfirm,emailConfirm);
  }

}
