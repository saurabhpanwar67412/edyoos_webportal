import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CookiePrivacyComponent } from './shared/cookie-privacy/cookieprivacy.component';
import { PrivacyComponent } from './shared/privacy/privacy.component';
import { TermsAndConditionComponent } from './shared/Terms/terms.component';

const routes: Routes = [
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile-page.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'cookie-policies',
    component: CookiePrivacyComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionComponent,
  },
  {
    path: '',
    redirectTo: 'landing/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'landing/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
