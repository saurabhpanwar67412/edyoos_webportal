export interface searchResultResponse {
  statusCode?: number;
  statusText?: string;
  data?: IPlace[];
}

export interface IPlace {
  id?: any;
  city?: any;
  propertyname?: any;
  latitude?: any;
  longitude?: any;
  distance?: any;
  propertyGroupID?: any;
  companyID?: any;
  locationID?: any;
  noOfSpots?: any;
  vehicleCategoryID?: any;
  accessHours?: any;
  allowOneVehicleOnly?: any;
  amenities?: any;
  description?: any;
  details?: any;
  howToRelease?: any;
  name?: any;
  tipToFind?: any;
  maximumRentalDays?: any;
  price?: any;
  additionalFee?: 0;
  isAdditionalFee?: false;
  bufferTime?: {
    ticks?: 0;
    days?: 0;
    hours?: 0;
    milliseconds?: 0;
    minutes?: 0;
    seconds?: 0;
    totalDays?: 0;
    totalHours?: 0;
    totalMilliseconds?: 0;
    totalMinutes?: 0;
    totalSeconds?: 0;
  };
  fromDate?: string;
  toDate?: string;
  pricingCode?: 0;
  parkingCategoryCode?: 0;
  parkingTypeCode?: 0;
  pricingAmount?: any;
}

export interface OldIPlace {
  id?: number;
  city?: string;
  propertyname?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  propertyGroupID?: number;
  companyID?: number;
  locationID?: number;
  noOfSpots?: number;
  vehicleCategoryID?: number;
  accessHours?: string;
  allowOneVehicleOnly?: boolean;
  amenities?: string;
  description?: string;
  details?: string;
  howToRelease?: string;
  name?: string;
  tipToFind?: string;
  maximumRentalDays?: number;
  fromDate;
  toDate;
}
const data = {};
