export class BookingModel {
    BookingID: number;
    Name: string;
    UserID: number;
    FromDate: Date;
    ToDate: Date;
    PropertyGroupID: number;
    ParkingPlace: string;
    ParkingTypeTypeCode: number;
    Duration: number;
    TotalAmount: number;
    IsPromoCodeUsed: boolean;
    PromoCodeID: number;
    LoggedInUserID: number;
    CreatedBy: string;
    ModifiedBy: string;
    VechicleLicensePlateNumber: string;
    VechicleMake: number;
    VechicleModel: number;
    Username: string;

    Address: string;

    Paymentstatus: string;

    Latitude: string;

    Longitude: string;
}