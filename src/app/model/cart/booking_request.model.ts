export class BookingRequest {
    BookingID: Number;
    Name: string;
    LoggedInUserID: number;
    TotalAmount: Number;
    LocationName: string;
    PhoneNumber: string;
    PropertyName: string;
    IsPromoCodeUsed: boolean;
    PromoCodeID: number;
    PromoCodeType: number;
    PromoCode: string;
    TrackPropertyGroup: TrackPropertyGroup[];
    PaymentRequestModel: PaymentRequestModel;
    CurrentAddress: string;
}

export class TrackPropertyGroup {
    TrackPropertyGroupID: Number;
    PropertyGroupID: Number;
    TotalNoSpots: Number;
    AvaliableParkingSpots: Number;
    BookingID: Number;
    UserID: Number;
    PaymentDetailsID: Number;
    LoggedInUserID: Number;
    LocationName: string;
    PropertyName: string;
    FromDate: Date;
    ToDate: Date;
    FromTime:string;
    ToTime:string;
    PropertyGroupAmount: number;
    AdditionalFee:number;
    PropertyGroupTotalAmount:number;
    VechicleRequestModel: VechicleRequestModel;
    PricingTypeCode:number;
    PmtRecurringStatus:number;
    PmtRecurringType:number;
}

export class VechicleRequestModel {
    VehicleID: Number;
    VehicleLicensePlateNumber: string;
    VehicleMake: string;
    VehicleModel: string;
    Color: string;
    UserId: number;
    IsDefault: boolean;
}
export class PaymentRequestModel {

    Email: string;
    IsGuestUser: boolean;
    PaymentMethodID: string;
    CustomerID: string;
    PaymentIntentID: string;
    PaymentStatusTypeCode: number;
    PaymentModeTypeCode: number;
    TotalAmount: number;
    ChargeFee: number;
    Net: number;
    PaymentDate: Date;
    Currency: string;


}