import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../shared/authentication/authentication.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService:AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                // console.error(err); 
                this.authenticationService.logout();  
                location.reload(true);            
            }
            else{
               
                return this.handleError(err);
            }

            
        }))
    }
    private handleError(error: HttpErrorResponse) {
        if(error.error?.errors){
            return throwError(
                error.error.errors[0].message);
            };
        
        return throwError(
            "Please Contact Support Team for any clarification");
        };
        // if (error.error instanceof ErrorEvent) {
        //   // A client-side or network error occurred. Handle it accordingly.
        //   console.error('An error occurred:', error.error.message);
        // } else {
        //   // The backend returned an unsuccessful response code.
        //   // The response body may contain clues as to what went wrong,
        //   console.error(
        //     `Backend returned code ${error.status}, ` +
        //     `body was: ${error.error}`);
        // }
        // return an observable with a user-facing error message
    //     return throwError(
    //       error.error);
    //   };
  }


