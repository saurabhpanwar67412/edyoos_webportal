import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { IPlace } from './place';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchText;
  private _selectedPlace: IPlace;
  private _fromDate;
  private _toDate;

  get searchText() {
    return this._searchText;
  }

  set searchText(value) {
    this._searchText = value;
  }

  get selectedPlace() {
    return this._selectedPlace;
  }

  set selectedPlace(value) {
    this._selectedPlace = value;
  }

  get fromDate() {
    return this._fromDate;
  }

  set fromDate(value) {
    this._fromDate = value;
  }

  get toDate() {
    return this._toDate;
  }

  set toDate(value) {
    this._toDate = value;
  }

  constructor() {}
}
