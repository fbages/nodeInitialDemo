import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';
import { FormBuilder,FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NicknameService } from 'src/app/services/nickname.service';

@Component({
  selector: 'app-xat',
  templateUrl: './xat.component.html',
  styleUrls: ['./xat.component.scss'],
})
export class XatComponent implements OnInit, AfterViewInit {
  // public userXat: string = 'Xat general';
  public userXat: Array<{ nomXat: string }> = [{ nomXat: 'Xat General' }];

  missatge: string;
  subscription: Subscription;
  subscriptionXats: Subscription;

  xatseleccionat: string = 'Xat General';
  xatsHabititats: Array<any> = [];
  nomRoom: string;

  taulell = this.fb.group({
    xats: this.fb.array([this.fb.control('')],[Validators.required, Validators.maxLength(2)]), 
  });

  constructor(
    private sockets: SocketsIoService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private nickNameService: NicknameService
  ) {
    //controlar si es la primera vegada que es registra
    if(this.nickNameService.nouRegistrat){
      setTimeout(() => {
        this.sockets.registrarJugador(); 
      }, 400);
    } else {
      setTimeout(() => {
        this.sockets.socketsInJugador(); 
      }, 400);
    }
    router.events.subscribe((val) => {
      let rutaXat;
      rutaXat = this.router.url.split('/');
      rutaXat[2] = rutaXat[2].replace('%20', ' ');

      if (this.xatseleccionat != rutaXat[2]) {
        this.xatseleccionat = rutaXat[2];
        this.llegirMissatges(rutaXat[2]);
      }
    });
  }

  logout(){
    this.router.navigate(['']);
  }

  //formbuilders funcions
  get xats() {
    return this.taulell.get('xats') as FormArray;
  }

  addXat() {
    this.xats.push(this.fb.control(''));
  }

  removeXat(index: number) {
    this.xats.removeAt(index);
  }

  //hooks
  ngOnInit(): void {
    this.subscription = this.sockets
      .getUltimMissatge()
      .subscribe((objectMissatge) => {
        // console.log (objectMissatge);
         if(objectMissatge.nomxat == this.xatseleccionat){
           this.rebreMissatge(objectMissatge.message, objectMissatge.nomJugador);
         }

      });

    this.subscriptionXats = this.sockets.crearXat().subscribe((nomXat) => {
      //console.log('Xat creat amb nom: ' + nomXat);

        let nomBuscat = this.userXat.findIndex((xat) => xat.nomXat == nomXat);
        //console.log(nomBuscat);
        if (nomBuscat == -1) {
          this.userXat.push({ nomXat: nomXat });
          this.addXat();
          this.llegirMissatges(nomXat);
          //this.router.navigate(['/xat/' + nomXat]);
        }
    
    });

    //llegir xats ja creats anteriorment publics i privats
    this.llegirXats();

    //descarga missatges xat general
    this.llegirMissatges('Xat General');
    
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement
      .querySelector('#botoEnviar')
      .addEventListener('click', this.enviarMissatge.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

  //funcions
  enviarMissatge() {
    this.missatge =
      this.elementRef.nativeElement.querySelector('#inputMissatge').value; //recull missatge del textbox
    if (this.missatge) {
      this.elementRef.nativeElement.querySelector('#inputMissatge').value = ''; //Buida el textbox per escriure un nou missatge
      let rutaXat = this.router.url.split('/');
      //console.log(rutaXat);
      rutaXat[2] = rutaXat[2].replace('%20', ' ');
      //console.log(rutaXat[2]);
      this.sockets.enviarMissatgeGeneral(this.missatge, rutaXat[2]); //Envia al servei el missatge

      this.elementRef.nativeElement.querySelector(
        '#llistatMissatges'
      ).innerHTML +=
        `<div style="color:green;text-align:right; align-self:flex-end;background-color:white;border-radius:5px;padding:3px;margin:3px;">` +
        this.missatge +
        '</div>';
    }

  }

  rebreMissatge(missatgeRebut, missatger) {
    this.missatge = missatgeRebut;
    this.elementRef.nativeElement.querySelector(
      '#llistatMissatges'
    ).innerHTML +=
      `<div style="color:red;text-align:left; align-self: flex-start;background-color:white; font-size: 11px; border-radius:5px;padding:1px;margin-top:3px;">` +
      missatger +
      '</div>' +
      `<div style="color:red;text-align:left; align-self: flex-start;background-color:white;border-radius:5px;padding:3px;margin:1px 3px 3px 3px;">` +
      this.missatge +
      '</div>';
  }

  // Cargar missatges de la base de dades
  async llegirMissatges(nomXat) {
    //console.log(nomXat);
    let missatgesXat = await this.loginService.llegirMissatges(nomXat);
    //console.log(missatgesXat['data']);
    this.elementRef.nativeElement.querySelector('#llistatMissatges').innerHTML =
      '';
    for (let i = 0; i < missatgesXat['data'].length; i++) {
      if (
        missatgesXat['data'][i]['jugador'] == this.nickNameService.getNickname()
      ) {
        this.elementRef.nativeElement.querySelector(
          '#llistatMissatges'
        ).innerHTML +=
          `<div style="color:green;text-align:right; align-self:flex-end;background-color:white;border-radius:5px;padding:3px;margin:3px;">` +
          missatgesXat['data'][i]['text'] +
          '</div>';
      } else {
        this.elementRef.nativeElement.querySelector(
          '#llistatMissatges'
        ).innerHTML +=
          `<div style="color:red;text-align:left; align-self: flex-start;background-color:white; font-size: 11px; border-radius:5px;padding:1px;margin-top:3px;">` +
          missatgesXat['data'][i]['jugador'] +
          '</div>' +
          `<div style="color:red;text-align:left; align-self: flex-start;background-color:white;border-radius:5px;padding:3px;margin:1px 3px 3px 3px;">` +
          missatgesXat['data'][i]['text'] +
          '</div>';
      }
    }
  }

  //Afegir xat privat
  afegirXat(nomXat: string) {
    let comprovacioXat = this.userXat.findIndex((xat) => xat.nomXat == nomXat);
    if (comprovacioXat == -1) {
      this.userXat.push({ nomXat: nomXat });
      this.addXat();
      this.llegirMissatges(nomXat);
      this.router.navigate(['/xat/' + nomXat]);
    }
  }

  //eliminar xat privat
  eliminarXat(index: number) {
    this.userXat.splice(index, 1);
    this.removeXat(index);
  }

  //nova Room Xat
  novaRoom() {
  
    //comprovar si el xat ja existeix
    let comprovacioXat = this.userXat.findIndex(
      (xat) => xat.nomXat == this.nomRoom
    );
    if (comprovacioXat == -1) {
          //comprovar si el nom de la sala té més d'un cararcter
      if(this.nomRoom.length <1 || this.nomRoom.replace(/\s/g, '')==''){
        return
      }
      this.userXat.push({ nomXat: this.nomRoom });
      this.addXat();
    }
    this.sockets.creadaSalaPublica(this.nomRoom);
    this.loginService.creacioSala(this.nomRoom);
    this.llegirMissatges(this.nomRoom);
    this.router.navigate(['/xat/' + this.nomRoom]);
  }

//llegir xats ja generats
async llegirXats(){
    //cargar totes les sales publiques
    let llistatXats = await this.loginService.llegirSales(this.nickNameService.nickname)
    //console.log(llistatXats['data']);
      for(let i=1; i< llistatXats['data'].length; i++){
        this.userXat.push({nomXat:llistatXats['data'][i]['nomxat']});
        this.addXat();
      }
   
}

}

