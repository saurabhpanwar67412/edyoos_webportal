// import { ErrorModel } from './login/error.model';

export class ApiResponse<T>{
    statusCode:string;
    statusText:string;
    data:T;
    errors:any[]
}