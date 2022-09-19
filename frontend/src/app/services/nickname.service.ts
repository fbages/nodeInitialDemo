import { Injectable,Optional, SkipSelf  } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NicknameService {

  nickname:string;
  private googleRegister = new Subject<any>();

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

  getGoogleStatus(){
    return this.googleRegister;
  }
  setGoogleStatus(value:boolean){
    return this.googleRegister.next(true);
  }

  subscripcionnickname(){
    return this.googleRegister.asObservable();
  }


}
