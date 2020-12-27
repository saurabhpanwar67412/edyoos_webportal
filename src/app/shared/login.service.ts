import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userStatusChanged: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  userLogin(params) {
    // return  this.http.post(`${environment.basePath}login`, params);
    return of({ username: 'user 1' });
  }
}
