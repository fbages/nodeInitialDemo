import { WindowRefService } from './services/window-ref.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { UiComponent } from './ui/ui.component';
import { IntroComponent } from './ui/intro/intro.component'
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent } from './ui/footer/footer.component';
import { HeaderComponent } from './ui/header/header.component';
import { StatsComponent } from './ui/stats/stats.component';
import { XatPrivatComponent } from './ui/xat-privat/xat-privat.component';
import { XatComponent } from './ui/xat/xat.component';
import { SocketsIoService } from './services/sockets-io/sockets-io.service';
import { MessageComponent } from './ui/message/message.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { ReactiveFormsModule } from '@angular/forms';

const appRoutes:Routes=[

  {path:'', component:IntroComponent},
  {path:'xat', component:UiComponent}
  
]

@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    IntroComponent,
    FooterComponent,
    HeaderComponent,
    StatsComponent,
    XatPrivatComponent,
    XatComponent,
    MessageComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    ReactiveFormsModule
  ],
  providers: [
    WindowRefService,
    SocketsIoService,
    [
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider('734855494394-5rs0al4gnaks6ivm5vds9r22v9g01090.apps.googleusercontent.com')
            }            
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
    ],
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
