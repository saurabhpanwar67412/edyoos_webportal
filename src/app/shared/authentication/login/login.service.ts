import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiRoutes } from 'src/app/shared/routes/apiroutes';
import { UserLogin } from 'src/app/model/login/login.model';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { ForgetPassword } from 'src/app/model/login/forget_password.model';
import { catchError } from 'rxjs/operators';
import { ResetPassword } from 'src/app/model/login/reset_password.model';
import { ChangePassword } from 'src/app/model/login/change_password.model';
import { User } from 'src/app/model/login/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  constructor(private http: HttpClient) {}

   userLogin(userLogin:UserLogin):Observable<ApiResponse<User>>{
      return this.http.post<ApiResponse<User>>(apiRoutes.login.userLogin,userLogin);
   }
   forgetPassword(forgetPassword:ForgetPassword){
    return this.http.post<ApiResponse<string>>(apiRoutes.login.forgetPassword,forgetPassword);
   }

   resetPassword(resetPassword:ResetPassword){
    return this.http.post<ApiResponse<string>>(apiRoutes.login.resetPassword,resetPassword);
   }
   changePassword(changePassword:ChangePassword){
    return this.http.post<ApiResponse<string>>(apiRoutes.login.changePassword,changePassword);
   }
}
