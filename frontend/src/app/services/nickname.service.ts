import { Injectable,Optional, SkipSelf  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NicknameService {

  nickname:string;

  constructor(@Optional() @SkipSelf() sharedService?: NicknameService) {
    if (sharedService) {
      throw new Error("Nicknameservice ja s'ha creat");
    }
   }

  getNickname(){
    return this.nickname;
  }

  setNickname(value:string){
    this.nickname = value;
  }
}
