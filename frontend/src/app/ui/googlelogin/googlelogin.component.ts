import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GoogleApiService, UserInfo } from 'src/app/services/google-api.service';
import { NicknameService } from 'src/app/services/nickname.service';

@Component({
  selector: 'app-googlelogin',
  templateUrl: './googlelogin.component.html',
  styleUrls: ['./googlelogin.component.scss']
})
export class GoogleloginComponent implements OnInit {

  userInfo?: UserInfo
  @Output() nicknameEvent = new EventEmitter<string>();
  constructor(
    private readonly googleApi: GoogleApiService,
    private nickNameService: NicknameService
    ) {
      googleApi.userProfileSubject.subscribe( info => {
        this.userInfo = info
        //console.log(JSON.stringify(info));
        this.nickNameService.setNickname(this.userInfo?.info?.name);
        console.log(this.nickNameService.getNickname());
        (<HTMLInputElement>document.getElementById("nom")).value =this.nickNameService.getNickname();
      })
   }

  ngOnInit(): void {

  }
  logout() {
    this.googleApi.signOut()
  }
}
