import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mode } from '../landing/main/main.component.metadata';
import { map, catchError, delay } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';
import { IPlace } from './place';
import { environment } from 'src/environments/environment';
import {SearchRequest} from '../model/search/search_request.model'
import { apiRoutes } from './routes/apiroutes';
import { ApiResponse } from '../model/apiresponse.model';
import { AvailableSpotsRequest } from '../model/Booking/available_spots.model';
@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  vehicleCategory: Subject<Mode> = new Subject<Mode>();

  itemsCountChanged: Subject<number> = new Subject<number>();
  itemsCount;

  addedCartPropertyGroup: Subject<any[]> = new Subject<any[]>();

  promocodeDiscountPercentage: Subject<number> = new Subject<number>();

  showBookedDetails:any;

  cartPropertyGroup:any[]=JSON.parse(localStorage.getItem('bookedPlaces')) || [];


  private tempPlaces: IPlace[] = [
    {
      id: 22,
      latitude: 24.726026,
      longitude: -81.0446262,
      name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
      fromDate: '2020-07-02T05:00:00',
      toDate: '2020-07-15T22:20:00',
      price: 10,
      distance: 100,
      details: 'Details of the Place',
    },
    {
      id: 23,
      latitude: 47.59948195707674,
      longitude: -122.30985900179657,
      name: 'Washington Square Parking',
      fromDate: '2020-06-25T01:00:00',
      toDate: '2020-07-05T22:20:00',
      price: 2,
      distance: 700,
      details: 'Details of the Place',
    },
    {
      id: 24,
      latitude: 35.7021051,
      longitude: 139.7750452,
      name: '975 F St NW Carroll Square Garage',
      fromDate: '2020-06-02T05:00:00',
      toDate: '2020-12-15T22:20:00',
      price: 5,
      distance: 50,
      details: 'Details of the Place',
    },
    {
      id: 25,
      latitude: 35.7021051,
      longitude: 139.7750452,
      name: 'Foley Square (101 to 117 Worth St)',
      fromDate: '2020-06-02T05:00:00',
      toDate: '2020-12-15T22:20:00',
      price: 15,
      distance: 500,
      details: 'Details of the Place',
    },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    //   fromDate: '2019-07-02T05:00:00',
    //   toDate: '2019-07-15T22:20:00',
    // },
    // {
    //   id: 22,
    //   latitude: 35.7021051,
    //   longitude: 139.7750452,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    //   fromDate: '2020-09-02T05:00:00',
    //   toDate: '2020-09-15T22:20:00',
    // },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    //   fromDate: '2020-12-02T05:00:00',
    //   toDate: '2020-12-15T22:20:00',
    // },
    // {
    //   id: 22,
    //   latitude: 35.7021051,
    //   longitude: 139.7750452,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 22,
    //   latitude: 35.7021051,
    //   longitude: 139.7750452,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 22,
    //   latitude: 35.7021051,
    //   longitude: 139.7750452,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 22,
    //   latitude: 35.7021051,
    //   longitude: 139.7750452,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
    // {
    //   id: 23,
    //   latitude: 47.59948195707674,
    //   longitude: -122.30985900179657,
    //   name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
    // },
  ];

  constructor(private http: HttpClient) {
    const bookedPlaces = JSON.parse(localStorage.getItem('bookedPlaces')) || [];
    this.itemsCount = bookedPlaces.length;
  }

  change(count) {
    this.itemsCount = count;
    this.itemsCountChanged.next(count);
  }

  getSearchResultForAuto(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.getSearchResultForAuto,searchRequest);
  }

  GetSearchResultforSeaPlanes(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforSeaPlanes,searchRequest);
  }

  GetSearchResultforBoats(searchRequest:SearchRequest):Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforBoats,searchRequest);
  }

  GetSearchResultforHelicopter(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforHelicopter,searchRequest);
  }

  GetSearchResultforAirPort(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforAirPort,searchRequest);
  }
  GetSearchResultforSemiTruck(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforSemiTruck,searchRequest);
  }
  GetSearchResultforTruckAndTrailer(searchRequest:SearchRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.search.GetSearchResultforTruckAndTrailer,searchRequest);
  }

  GetPropertyGroupDetail(propertyGroupID:number):Observable<ApiResponse<any>>{
    return this.http.get<ApiResponse<any>>(`${apiRoutes.detail.GetPropertyGroupDetail}?propertyGroupId=${propertyGroupID}`);
  }

  CheckForAvaliableSpots(availableSpotsRequest:any):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.booking.CheckForAvaliableSpots,availableSpotsRequest);
  }
  SpotAvalibilityCheckonCheckOut(availableSpotsRequest:AvailableSpotsRequest):Observable<any>{
    return this.http.post<ApiResponse<any>>(apiRoutes.booking.SpotAvalibilityCheckonCheckOut,availableSpotsRequest);
  }

  getPlaceByID() {
    // TODO: call BE to get place by id
    return of({
      id: 99,
      latitude: 24.726026,
      longitude: -81.0446262,
      price: 20,
      name: "Porky's Marina and Restaurant Boats up to 35 ft***DAILY RATE***",
      accessHours:
        'An hour (symbol: h;[1] also abbreviated hr) is a unit of time conventionally reckoned as ​1⁄24 of a day and scientifically reckoned as 3,599–3,601 seconds, depending on conditions. There are 60 minutes in an hour, and 24 hours in a day.',
      amenities:
        'In real estate and lodging, an amenity (lat. amoenitās “pleasantness, delightfulness”) is something considered to benefit a property and thereby increase its value.[1] Tangible amenities can include the number and nature of guest rooms and the provision of facilities such as elevators (lifts), wi-fi, restaurants, parks, communal areas, swimming pools, golf courses, health club facilities, party rooms, theater or media rooms, bike paths or garages, while intangible amenities can include aspects such as well-integrated public transport, pleasant views, nearby activities and a low crime rate. Within the context of environmental economics, an environmental amenity can include access to clean air or clean water, or the quality of any other environmental good that may reduce adverse health effects for residents or increase their economic welfare.[2] Amenities also come in the form of Mobile Amenities. Many Commercial Real-estate companies, property managers and apartment complexes enhance the amenities with mobile businesses.',
      description:
        'Description is the pattern of narrative development that aims to make vivid a place, object, character, or group.[1] Description is one of four rhetorical modes (also known as modes of discourse), along with exposition, argumentation, and narration.[2] In practice it would be difficult to write literature that drew on just one of the four basic modes',
      details: `In computer graphics, accounting for Level of detail[1][2][3] (LOD) involves decreasing the complexity of a 3D model representation as it moves away from the viewer or according to other metrics such as object importance, viewpoint-relative speed or position. Level of detail techniques increase the efficiency of rendering by decreasing the workload on graphics pipeline stages, usually vertex transformations. The reduced visual quality of the model is often unnoticed because of the small effect on object appearance when distant or moving fast.

    Although most of the time LOD is applied to geometry detail only, the basic concept can be generalized. Recently, LOD techniques also included shader management to keep control of pixel complexity. A form of level of detail management has been applied to texture maps for years, under the name of mipmapping, also providing higher rendering quality.
    
    It is commonplace to say that "an object has been LOD'd" when the object is simplified by the underlying LOD-ing algorithm.`,
      howToRelease:
        'help us manage stress depending on how we react to it in the body. In her ongoing body work with clients, Roxburgh says she can actually see and feel stress stuck in the body—and that it tends to build up in five areas, depending on how each individual responds to stress (i.e. are you a jaw clencher or do you hunch your shoulders?); Roxburgh calls these five areas the stress containers.',
      tipToFind:
        'Have you ever attempted to identify the location of your target property but found it difficult because you lack the resources? If so, you may have also realized that it can be equally challenging to communicate your location with others. Whether you are seeking a cost estimate for a project or simply trying to explain where you next potential Phase I site is, having the proper resources at your disposal can save you time, money, and stress. While some organizations may have a GIS guru donate their skills in this type of situation, others cannot afford such a luxury. Many people may then resort to printing out paper maps, drawing site boundaries by hand, and then scanning them in. However, this method is not always accurate (nor pretty), plus who has that kind of time on their hands?',
    });
  }

  getNearbyPlaces() {
    // TODO: call BE to get nearby places
    return of(this.tempPlaces);
  }

  addToFavorites() {
    // TODO: call BE to add place to favorites
  }

  reserve(params) {
    // TODO: call BE to reserve place
    return of(true);
  }
}
