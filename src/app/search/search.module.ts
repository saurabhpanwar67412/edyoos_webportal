import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'ng2-tooltip-directive';
import { RemovewhitespacesPipe } from './search-page/removewhitespaces.pipe';


@NgModule({
  declarations: [SearchPageComponent],
  imports: [
    SearchRoutingModule,
    SharedModule,
    DpDatePickerModule,
    MatTooltipModule,
    TooltipModule
  ],
  providers: [GoogleMap],
})
export class SearchModule {}
