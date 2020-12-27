export class UpdatePaymentRequest{
    PaymentId:string;
    CardUpdate:CardUpdateRequest=new CardUpdateRequest();
    BillingDetailsUpdate:BillingUpdateRequest=new BillingUpdateRequest();
}

export class CardUpdateRequest{
    ExpMonth:number;
    ExpYear:number;
}

export class BillingUpdateRequest{
    Email:string;
    Name:string;
    Phone:string;
    AddressUpdate:AddressUpdateRequest=new AddressUpdateRequest();
}

export class AddressUpdateRequest{
    City:string;
    Country:string;
    Line1:string;
    Line2:string;
    PostalCode:string;
    State:string;
}