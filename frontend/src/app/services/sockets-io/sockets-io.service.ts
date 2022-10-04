import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { NicknameService } from '../nickname.service';


@Injectable()
//   {
//   providedIn: 'root',
// } // o estar registrat a appmodule per estar disponible a totarreu
export class SocketsIoService {
  public jugadorsSocket = io('http://localhost:3000/jugadors');
  public missatgesSocket = io('http://localhost:3000/missatges');
  public xatsSocket = io('http://localhost:3000/xats');
  nomJugador: string;
  email: string;
  password: string;
  xatPrivat: string;

  private jugadorsRebuts = new Subject<any>();
  private jugadorsRebutsDesconectats = new Subject<any>();
  private missatgeRebutG = new Subject<any>();
  private peticioXatP = new Subject<any>();
  private missatgeRebutP = new Subject<any>();
  private confirmacioXatP = new Subject<any>();
  //private xatnouP = new Subject<any>();

  constructor( public nicknamService: NicknameService,
    @Optional() @SkipSelf() sharedService?: SocketsIoService) {
    if (sharedService) {
      throw new Error("Sockets ja s'ha creat");
    }
    //Registrar sockets a la base de dades
    this.nomJugador = this.nicknamService.nomJugador;
    this.email = this.nicknamService.email;
    this.password = this.nicknamService.password;

    this.missatgesSocket.on('chat message', (msg, jugador, nomXat) => {
      console.log(msg,jugador,nomXat);
      this.missatgeRebutG.next({ message: msg, nomJugador: jugador, nomxat:nomXat });
    });

    this.jugadorsSocket.on('altresjugadors', (jugadorExtern: string) => {
      this.jugadorsRebuts.next(jugadorExtern);
    });

    this.jugadorsSocket.on(
      'jugadorDesconecat',
      (nomJugadorDesconectat: string) => {
        //console.log("Sha desconectat"+nomJugadorDesconectat)
        this.jugadorsRebutsDesconectats.next(nomJugadorDesconectat);
      }
    );

    //Rebre peticio per parlar privat
    this.xatsSocket.on('Aceptacio parlar', (msg, usuariPeticio) => {
      //console.log('Has rebut peticio de : ' + usuariPeticio);
      this.peticioXatP.next(usuariPeticio);
    });

    //confirmacio de peticio aceptada
    this.xatsSocket.on('Acceptat', (nomJugadorDemanat, nomJugadorPeticio) => {
      let nomXat = nomJugadorDemanat + '*' + nomJugadorPeticio;
      this.confirmacioXatP.next(nomXat);
    });

    //Rebre missatge privat
    this.xatsSocket.on(
      'Missatge privat distribuit',
      (anfitrioRoom, nomMissatger, msg) => {
        // console.log(`Missatge: ${msg}, enviat per ${nomMissatger}, distribuit a la sala socket de ${anfitrioRoom}`);
        let paquet = { text: msg, emisor: nomMissatger };
        this.missatgeRebutP.next(paquet);
      }
    );

    this.xatsSocket.on('crea xat public', (nomXat) => {
      //console.log(nomXat + ' arribat del servidor')
      this.confirmacioXatP.next(nomXat);
    });

  }


  crearXat() {
    return this.confirmacioXatP.asObservable();
  }

  getUltimMissatge() {
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
      this.xatsSocket.id,
      this.email,
      this.password
    );
  };

  socketsInJugador() {

    setTimeout(() => {
      
          this.jugadorsSocket.emit(
            'socketsInJugador',
            this.nomJugador,
            this.jugadorsSocket.id,
            this.missatgesSocket.id,
            this.xatsSocket.id,
            this.nicknamService.email,
            this.password
            );
        }, 500);

  }

  enviarMissatgeGeneral(missatge: string, nomxat: string) {
    if (missatge) {
      console.log(missatge,nomxat);
      this.missatgesSocket.emit('chat message', missatge, nomxat);
    }
  }

  enviarJugador(jugador: Object) {
    //console.log(jugador, "a punt d'enviar a socket");
    //setTimeout(() => {
    this.jugadorsSocket.emit('jugador', jugador);
    //},500);
  }

  getJugadors() {
    return this.jugadorsRebuts.asObservable();
  }
  getJugadorsDesconectats() {
    return this.jugadorsRebutsDesconectats.asObservable();
  }

  peticioXatPrivat(nomJugadorDemanat: string, nomJugadorPeticio: string) {
    this.xatsSocket.emit('Peticio', nomJugadorDemanat, nomJugadorPeticio);
  }

  rebrepeticioXatPrivat() {
    return this.peticioXatP.asObservable();
  }

  confirmacioPeticioXatPrivat(
    nomJugadorDemanat: string,
    nomJugadorPeticio: string
  ) {
    this.confirmacioXatP.next(nomJugadorDemanat + '*' + nomJugadorPeticio);
    this.xatsSocket.emit(
      'registrar xat privat',
      nomJugadorDemanat + '*' + nomJugadorPeticio
    );
    this.xatsSocket.emit('Si accepto', nomJugadorDemanat, nomJugadorPeticio);
  }

  // enviarMissatgePrivat(missatge: string, destinatari) {
  //   console.log('Missatge privat' + missatge);
  //   if (missatge) {
  //     this.xatsSocket.emit(
  //       'Missatge privat',
  //       destinatari,
  //       this.nomJugador,
  //       missatge
  //     );
  //   }
  // }
  // rebreUltimMissatgePrivat() {
  //   return this.missatgeRebutP.asObservable();
  // }

  creadaSalaPublica(nomXat: string) {
    this.xatsSocket.emit('xat public', nomXat);
    setTimeout(() => {
      
      console.log('afegit a la room de la nova sala')
      this.missatgesSocket.emit('nou chat');
    }, 500);
    }

  //ajuda
  // crearSockets() {
  //   // function prova() {
  //   //   setTimeout(() => {
  //   //     this.jugadorsSocket.emit('prova', 'Hola aixo es una prova');
  //   //     console.log('enviada prova');
  //   //     //this.xatPrivat = invitador;
  //   //   }, 3000);
  //   // }
  //   // //Peticio de conectar-se a un xat privat
  //   // document.getElementById('privatxat').addEventListener('click', () => {
  //   //   let socketinvitacio = document.getElementById('privatsocket').value;
  //   //   console.log(socketinvitacio);
  //   //   this.xatsSocket.emit('Peticio', socketinvitacio);
  //   // });
  //   // //Rebre peticio exterior
  //   // this.xatsSocket.on('Aceptacio parlar', (msg, usuariPeticio) => {
  //   //   console.log('Has rebut peticio de : ' + usuariPeticio);
  //   //   document.getElementById('peticiosocket').value = usuariPeticio;
  //   // });
  //   // //Confirmar peticio exterior
  //   // document.getElementById('peticioxat').addEventListener('click', () => {
  //   //   let invitador = document.getElementById('peticiosocket').value;
  //   //   console.log('invitat per: ' + invitador);
  //   //   this.xatsSocket.emit('Si accepto', invitador);
  //   //   this.xatPrivat = invitador;
  //   // });
  //   // //Informat que has sigut acceptat
  //   // this.xatsSocket.on('Acceptat', (invitador) => {
  //   //   document.getElementById('privatsocket').style.backgroundColor = 'green';
  //   //   this.xatPrivat = invitador;
  //   // });
  //   // //Enviar missatge privat
  //   // document.getElementById('missatgeprivat').addEventListener('click', () => {
  //   //   let text = document.getElementById('enviamissatgeprivat').value;
  //   //   //let socketRoom = document.getElementById("peticiosocket").value || xatsSocket.id;
  //   //   this.xatsSocket.emit('Missatge privat', this.xatPrivat, this.nomJugador, text);
  //   // });
  //   //rebre missatge privat
  //   // this.xatsSocket.on(
  //   //   'Missatge privat distribuit',
  //   //   (anfitrioRoom, nomMissatger, msg) => {
  //   //     console.log(
  //   //       `Missatge: ${msg}, enviat per ${nomMissatger}, distribuit a la sala socket de ${anfitrioRoom}`
  //   //     );
  //   //   }
  //   // );
  // }
}
