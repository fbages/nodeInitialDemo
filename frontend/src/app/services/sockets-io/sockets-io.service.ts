import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io } from 'socket.io-client';


@Injectable()
//   {
//   providedIn: 'root',
// } // o estar registrat a appmodule per estar disponible a totarreu
export class SocketsIoService {
  public jugadorsSocket = io('http://localhost:3000/jugadors');
  public missatgesSocket = io('http://localhost:3000/missatges');
  public xatsSocket = io('http://localhost:3000/xats');
  nomJugador: string;
  xatPrivat: string;
  
  private jugadorsRebuts = new Subject<any>();
  private missatgeRebutG = new Subject<any>();
  private peticioXatP = new Subject<any>();
  private missatgeRebutP = new Subject<any>();
    
  constructor(@Optional() @SkipSelf() sharedService?: SocketsIoService) {
    if (sharedService) {
      throw new Error("Sockets ja s'ha creat");
    }

    this.missatgesSocket.on('chat message', (msg:string)=> {
      console.log(msg);
      this.missatgeRebutG.next(msg);
    });

    this.jugadorsSocket.on("altresjugadors", (jugadorExtern:string)=>{
        this.jugadorsRebuts.next(jugadorExtern);
    })

    //Rebre peticio per parlar privat
    this.xatsSocket.on('Aceptacio parlar', (msg, usuariPeticio) => {
      console.log('Has rebut peticio de : ' + usuariPeticio);
       this.peticioXatP.next(usuariPeticio);
      });

      //Rebre missatge privat
    this.xatsSocket.on('Missatge privat distribuit',(anfitrioRoom, nomMissatger, msg) => {
      console.log(`Missatge: ${msg}, enviat per ${nomMissatger}, distribuit a la sala socket de ${anfitrioRoom}`);
      let paquet = {"text": msg, "emisor": nomMissatger};
      this.missatgeRebutP.next(paquet);
   });

  }

  getUltimMissatge(){
    return this.missatgeRebutG.asObservable();
  }

  getJugadorsocket(): object {
    return this.jugadorsSocket;
  }

  registrarJugador() {
      this.jugadorsSocket.emit(
        'nouJugador',
        this.nomJugador,
        this.jugadorsSocket.id,
        this.missatgesSocket.id,
        this.xatsSocket.id
      );
  }

  enviarMissatgeGeneral(missatge:string){
      console.log(missatge);
      if (missatge) {
        this.missatgesSocket.emit('chat message', missatge);
      }
  }

  enviarJugador(jugador:Object){
    //console.log(jugador, "a punt d'enviar a socket");
    //setTimeout(() => {
      this.jugadorsSocket.emit('jugador', jugador);
    //},500);
  }
  
  getJugadors(){
    return this.jugadorsRebuts.asObservable();
  }

  peticioXatPrivat(nomJugadorDemanat:string, nomJugadorPeticio:string ){
     this.xatsSocket.emit('Peticio', nomJugadorDemanat, nomJugadorPeticio);
  }

  rebrepeticioXatPrivat(){
    return this.peticioXatP.asObservable();
  }

  confirmacioPeticioXatPrivat(nomJugadorDemanat:string, nomJugadorPeticio:string ){
    this.xatsSocket.emit('Si accepto', nomJugadorDemanat, nomJugadorPeticio);
  }

  enviarMissatgePrivat(missatge:string, destinatari){
    console.log('Missatge privat' + missatge);
    if (missatge) {
      this.xatsSocket.emit('Missatge privat', destinatari, this.nomJugador, missatge);
    }
}
  rebreUltimMissatgePrivat(){
  return this.missatgeRebutP.asObservable();
}

//ajuda
  crearSockets() {

    // function prova() {
    //   setTimeout(() => {
    //     this.jugadorsSocket.emit('prova', 'Hola aixo es una prova');
    //     console.log('enviada prova');
    //     //this.xatPrivat = invitador;
    //   }, 3000);
    // }

    // //Peticio de conectar-se a un xat privat
    // document.getElementById('privatxat').addEventListener('click', () => {
    //   let socketinvitacio = document.getElementById('privatsocket').value;
    //   console.log(socketinvitacio);
    //   this.xatsSocket.emit('Peticio', socketinvitacio);
    // });

    // //Rebre peticio exterior
    // this.xatsSocket.on('Aceptacio parlar', (msg, usuariPeticio) => {
    //   console.log('Has rebut peticio de : ' + usuariPeticio);
    //   document.getElementById('peticiosocket').value = usuariPeticio;
    // });

    // //Confirmar peticio exterior
    // document.getElementById('peticioxat').addEventListener('click', () => {
    //   let invitador = document.getElementById('peticiosocket').value;
    //   console.log('invitat per: ' + invitador);
    //   this.xatsSocket.emit('Si accepto', invitador);
    //   this.xatPrivat = invitador;
    // });

    // //Informat que has sigut acceptat
    // this.xatsSocket.on('Acceptat', (invitador) => {
    //   document.getElementById('privatsocket').style.backgroundColor = 'green';
    //   this.xatPrivat = invitador;
    // });

    // //Enviar missatge privat
    // document.getElementById('missatgeprivat').addEventListener('click', () => {
    //   let text = document.getElementById('enviamissatgeprivat').value;
    //   //let socketRoom = document.getElementById("peticiosocket").value || xatsSocket.id;
    //   this.xatsSocket.emit('Missatge privat', this.xatPrivat, this.nomJugador, text);
    // });

    //rebre missatge privat
    // this.xatsSocket.on(
    //   'Missatge privat distribuit',
    //   (anfitrioRoom, nomMissatger, msg) => {
    //     console.log(
    //       `Missatge: ${msg}, enviat per ${nomMissatger}, distribuit a la sala socket de ${anfitrioRoom}`
    //     );
    //   }
    // );
  }
}
