import { NgModule } from '@angular/core';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { WebcamModule } from 'ngx-webcam';
import { TakePhotoComponent } from './profile-page/take-photo/take-photo.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'
import { EditLicensePlateComponent } from './profile-page/EditLicensePlate/EditLicensePlate.component';

@NgModule({
  declarations: [
    // ProfilePageComponent,
    TakePhotoComponent,
    EditLicensePlateComponent
  ],
  entryComponents: [TakePhotoComponent],
  imports: [
    SharedModule,
    ProfilePageRoutingModule,
    WebcamModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule
  ],
})
export class ProfilePageModule { }
