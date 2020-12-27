import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from './material.module';
import { EmailUsComponent } from '../footer/email-us/email-us.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserNavBarComponent } from '../user-nav-bar/user-nav-bar.component';
import { AvailableSpotsComponent } from '../available-spots/available-spots.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RemovewhitespacesPipe } from '../search/search-page/removewhitespaces.pipe';
import { RouterModule } from '@angular/router';
import { NavBarNewComponent } from '../navbar-new/navbar-new.component';
import { EnumToArrayPipe } from './pipe/enumtoarray.pipe';
import { environment } from 'src/environments/environment';
import { VehicleFilterPipe } from './pipe/searchFilter.pipe';


@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey,
      libraries: ['places'],
    }),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgbModule,
    MatDialogModule,
    MatToolbarModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    TooltipModule,
    RouterModule
  ],
  entryComponents: [EmailUsComponent],
  declarations: [NumbersOnlyDirective, NavBarNewComponent, NavBarComponent, EnumToArrayPipe,VehicleFilterPipe, UserNavBarComponent, AvailableSpotsComponent, FooterComponent, EmailUsComponent, SideBarComponent, RemovewhitespacesPipe],
  exports: [
    CommonModule,
    FormsModule,
    AgmCoreModule,
    ReactiveFormsModule,
    MaterialModule,
    NgbModule,
    NumbersOnlyDirective,
    NavBarComponent,
    UserNavBarComponent, AvailableSpotsComponent,
    NavBarNewComponent,
    MatDialogModule,
    MatToolbarModule,
    MatRadioModule,
    MatChipsModule,
    RouterModule,
    MatExpansionModule,
    TooltipModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    FooterComponent,
    SideBarComponent,
    MatInputModule,
    MatFormFieldModule,
    RemovewhitespacesPipe,
    EnumToArrayPipe,
    VehicleFilterPipe
  ],
})
export class SharedModule { }
