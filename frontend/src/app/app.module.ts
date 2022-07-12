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

const appRoutes:Routes=[

  {path:'', component:IntroComponent}
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
    XatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    WindowRefService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
