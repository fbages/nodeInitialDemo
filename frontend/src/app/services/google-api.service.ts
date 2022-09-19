import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/google',// window.location.origin,
  clientId: environment.GOOGLE_API_KEY,
  scope: 'openid profile email',
  showDebugInformation: true,
  //postLogoutRedirectUri:"http://localhost:4200/"
}

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {
 // confiure oauth2 service
 oAuthService.configure(authCodeFlowConfig);
 // manually configure a logout url, because googles discovery document does not provide it
 oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
 //oAuthService.logoutUrl = "http://localhost:4200/";
 
 // loading the discovery document from google, which contains all relevant URL for
 // the OAuth flow, e.g. login url
 oAuthService.loadDiscoveryDocument().then( () => {
   // // This method just tries to parse the token(s) within the url when
   // // the auth-server redirects the user back to the web-app
   // // It doesn't send the user the the login page
   oAuthService.tryLoginImplicitFlow().then( () => {

     // when not logged in, redirecvt to google for login
     // else load user profile
     if (!oAuthService.hasValidAccessToken()) {
       oAuthService.initLoginFlow()
     } else {
       oAuthService.loadUserProfile().then( (userProfile) => {
         this.userProfileSubject.next(userProfile as UserInfo)
       })
     }

   })
 });
}

   
  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut() {
    //delete localStorage.user;
    this.oAuthService.logOut();
  }

  private authHeader() : HttpHeaders {
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }
}
