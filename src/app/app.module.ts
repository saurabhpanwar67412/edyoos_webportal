import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer, DefaultUrlSerializer, UrlTree } from '@angular/router';
import { BearerAuthInterceptor } from './helper/bearer-auth.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoaderService } from './shared/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './shared/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogModule } from './shared/confirm-dialog/confirm-dialog.module';
import { PrivacyComponent } from './shared/privacy/privacy.component'
import { RemovewhitespacesPipe } from './search/search-page/removewhitespaces.pipe';
import { TermsAndConditionComponent } from './shared/Terms/terms.component';
import { CookiePrivacyComponent } from './shared/cookie-privacy/cookieprivacy.component';
import { NgxBarcodeModule } from 'ngx-barcode';


export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    return super.parse(url.toLowerCase());
  }
}

@NgModule({
  declarations: [AppComponent, PrivacyComponent, TermsAndConditionComponent, CookiePrivacyComponent],
  imports: [BrowserModule, AppRoutingModule,
    HttpClientModule, BrowserAnimationsModule, FormsModule,
    ReactiveFormsModule, SharedModule, NgxSpinnerModule, ConfirmDialogModule, MaterialModule, MatTooltipModule,
    NgxBarcodeModule
  ],
  providers: [
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BearerAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }

