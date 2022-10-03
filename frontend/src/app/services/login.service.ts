import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Resposta {
  data: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  async buscarMail(email:string){
    return await this.http.post('/api/email',{"email":email}).toPromise();
  }

  async buscarNickname(nickname:string){
    return await this.http.post('/api/nickname',{'nom': nickname}).toPromise();
  }

  async registrarNouJugador(jugador:object){
    return await this.http.post('/api/registrarNom',jugador).toPromise();
  }

  async signInJugador(jugador:object){
    return await this.http.post('/api/signIn',jugador).toPromise();
  }

  async getNickname(email:string){
    return await this.http.post('/api/getnickname', {'email':email}).toPromise();
  }

  async llegirMissatges(nomXat:string){
    return await this.http.post('/api/missatges', {'nomXat':nomXat}).toPromise();
  }
  
  async llegirSales(nickname:string){
    return await this.http.post('/api/llegirsales', {'nom': nickname}).toPromise();
  }

  async creacioSala(nomXat:string){
    return await this.http.post('/api/creaciosala',{'nomXat':nomXat}).toPromise();
  }
}
