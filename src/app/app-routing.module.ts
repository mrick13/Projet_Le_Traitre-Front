import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountComponent } from './account/account/account.component';
import { LobbyComponent } from './lobby/lobby/lobby.component';
import { PartyComponent } from './party/party/party.component';
import { EndComponent } from './party/end/end.component';
import { ProfileComponent } from './profile/profile/profile.component';
import {SearchComponent} from './search/search/search.component';
import {LobbyLoadingComponent} from './lobby/lobby-loading/lobby-loading.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'lobby/:id', component: LobbyComponent },
  { path: 'lobby-loading/:id', component: LobbyLoadingComponent },
  { path: 'search', component: SearchComponent },
  { path: 'party', component: PartyComponent },
  { path: 'end', component: EndComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
