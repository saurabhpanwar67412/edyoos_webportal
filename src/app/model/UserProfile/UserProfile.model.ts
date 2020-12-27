import { VechicleRequestModel } from '../cart/booking_request.model';

export class UserProfile {
    userProfileDetailsID: number;
    name: string;
    userID: number;
    email:string;

    phoneNumber: string;
    currency: string;
    address: string;
    aboutYou:string;

    photo: string;
    timeZone: string;
    createdBy: string;
    modifiedBy:string;

    isActive: boolean;
    isDelete: boolean;
    dataAction: string;
    files:any;
    gender:string;
    vehicleRequests:VechicleRequestModel[]
}