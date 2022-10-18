import { Injectable,Optional, SkipSelf  } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NicknameService {
  nomJugador:string;
  email:string;
  password:string;
  nouRegistrat:boolean = false;

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
    this.nickname = value.trim();
    this.nomJugador = value.trim();
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

  getEmail(){
    return this.email;
  }

  setEmail(value:string){
    this.email = value.trim();
  }

  getPassword(){
    return this.password;
  }

  setPassword(value:string){
    this.password = value;
  }

}
