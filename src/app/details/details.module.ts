import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';
import { DetailsPageComponent } from './details-page/details-page.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemAddedComponent } from './item-added/item-added.component';
import { RemovewhitespacesPipe } from '../search/search-page/removewhitespaces.pipe';

@NgModule({
  declarations: [DetailsPageComponent],
  imports: [
    DetailsRoutingModule,
    SharedModule,
    // GoogleMapsModule,
    DpDatePickerModule
    
  ],
  entryComponents: [ShareModalComponent, ItemAddedComponent],
  providers: [GoogleMap],
})
export class DetailsModule { }
