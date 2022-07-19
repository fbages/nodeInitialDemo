import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io } from 'socket.io-client';


@Injectable()
//   {
//   providedIn: 'root',
// } // o estar registrat a appmodule per estar disponible a totarreu
export class SocketsIoService {
  public jugadorsSocket = io('/jugadors');
  public missatgesSocket = io('/missatges');
  public xatsSocket = io('/xats');
  nomJugador: string;
  xatPrivat: string;
  
  private jugadorsRebuts = new Subject<any>();
  private missatgeRebutG = new Subject<any>() ;
    
  constructor(@Optional() @SkipSelf() sharedService?: SocketsIoService) {
    if (sharedService) {
      throw new Error("Sockets ja s'ha creat");
    }
    
    console.log("Sockets s'ha creat correctament");
    setTimeout(() => {
      console.log(this.jugadorsSocket['id']);
      setTimeout(() => {
        this.jugadorsSocket.emit('prova', 'Hola aixo es una prova');
        console.log('enviada prova');
      }, 1000);
    }, 2000);
  
    this.missatgesSocket.on('chat message', (msg:string)=> {
      console.log(msg);
      this.missatgeRebutG.next(msg);
    });

    this.jugadorsSocket.on("altresjugadors", (altresjugadors:any)=>{
      //console.log(altresjugadors, 'ha arribat nova posicio a Angular');
      this.jugadorsRebuts.next(altresjugadors);
    })

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
    this.jugadorsSocket.emit('jugador', jugador);
  }
  
  getJugadors(){
    return this.jugadorsRebuts.asObservable();
  }

  crearSockets() {

    function prova() {
      setTimeout(() => {
        this.jugadorsSocket.emit('prova', 'Hola aixo es una prova');
        console.log('enviada prova');
      }, 3000);
    }

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
