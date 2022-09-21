import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
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
  public userXat: Array<{ nomXat: string }>=[{ nomXat: 'Xat General' }];

  missatge: string;
  subscription: Subscription;
  subscriptionXats: Subscription;

  xatseleccionat: string = 'Xat General';
  xatsHabititats:Array<any>=[];
  xatseleccionataux: string = 'Xat General';
  nomRoom: string;

  taulell = this.fb.group({
    xats: this.fb.array([this.fb.control('')]),
  });

  constructor(
    private sockets: SocketsIoService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private nickNameService: NicknameService
  ) {
    // route.params.subscribe((params) => {
    //   this.userXat = params['id'];
    // });
    router.events.subscribe(val => {
      let rutaXat;
      rutaXat = this.router.url.split('/');
      rutaXat[2] = rutaXat[2].replace('%20', ' ');
      
      if(this.xatseleccionat!=rutaXat[2]){
        this.xatseleccionat=rutaXat[2];
        this.llegirMissatges(rutaXat[2]);
      }
    });
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
    this.subscription = this.sockets.getUltimMissatge().subscribe((objectMissatge) => {
      console.log('missatge ' + objectMissatge.message, 'de ' + objectMissatge.nomJugador);
      this.rebreMissatge(objectMissatge.message, objectMissatge.nomJugador);
    });

    this.subscriptionXats = this.sockets.crearXat().subscribe((nomXat) => {
      
      console.log('Xat creat amb nom: ' + nomXat);
      
      let nomBuscat = this.userXat.findIndex(xat => xat.nomXat == nomXat);
      console.log(nomBuscat);
      if(nomBuscat==-1){
        this.userXat.push({nomXat: nomXat }); 
        this.addXat();
        this.llegirMissatges(nomXat);
        this.router.navigate(['/xat/' + nomXat]);
      }
    }
    );
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
      console.log(rutaXat);
      rutaXat[2] = rutaXat[2].replace('%20', ' ');
      this.sockets.enviarMissatgeGeneral(this.missatge, rutaXat[2]); //Envia al servei el missatge

      this.elementRef.nativeElement.querySelector(
        '#llistatMissatges'
      ).innerHTML +=
        `<div style="color:green;text-align:right; align-self:flex-end;background-color:white;border-radius:5px;padding:3px;margin:3px;">` +
        this.missatge +
        '</div><br>';
    }
    
    let aux = {
      id: this.userXat.length,
      text: this.missatge,
      usuari: this.missatge,
    };
  }

  rebreMissatge(missatgeRebut, missatger) {
    this.missatge = missatgeRebut;
    this.elementRef.nativeElement.querySelector(
      '#llistatMissatges'
    ).innerHTML +=
    `<div style="color:red;text-align:left; align-self: flex-start;background-color:white; font-size: 11px; border-radius:5px;padding:1px;margin-top:3px;">` +
    missatger +
    '</div><br>'+
      `<div style="color:red;text-align:left; align-self: flex-start;background-color:white;border-radius:5px;padding:3px;margin:1px 3px 3px 3px;">` +
      this.missatge +
      '</div><br>';
  }

// Cargar missatges de la base de dades
  async llegirMissatges(nomXat){
    
    console.log(nomXat);
    let missatgesXat = await this.loginService.llegirMissatges(nomXat);
    console.log(missatgesXat['data']);
    this.elementRef.nativeElement.querySelector(
      '#llistatMissatges'
    ).innerHTML=""
    for(let i=0; i < missatgesXat['data'].length; i++){
      if(missatgesXat['data'][i]['jugador']==this.nickNameService.getNickname()){
        this.elementRef.nativeElement.querySelector(
          '#llistatMissatges'
        ).innerHTML +=
          `<div style="color:green;text-align:right; align-self:flex-end;background-color:white;border-radius:5px;padding:3px;margin:3px;">` +
          missatgesXat['data'][i]['text'] +
          '</div><br>';
      }else{
        this.elementRef.nativeElement.querySelector(
          '#llistatMissatges'
        ).innerHTML +=
        `<div style="color:red;text-align:left; align-self: flex-start;background-color:white; font-size: 11px; border-radius:5px;padding:1px;margin-top:3px;">` +
        missatgesXat['data'][i]['jugador'] +
        '</div><br>'+
          `<div style="color:red;text-align:left; align-self: flex-start;background-color:white;border-radius:5px;padding:3px;margin:1px 3px 3px 3px;">` +
          missatgesXat['data'][i]['text'] +
          '</div><br>';
      }
    }
  }

  //Afegir xat privat
  afegirXat(nomXat:string) {
    let comprovacioXat = this.userXat.findIndex((xat)=>(xat.nomXat)==nomXat);
    if(comprovacioXat == -1){
      this.userXat.push({ nomXat: nomXat });
      this.addXat();
      this.llegirMissatges(nomXat);
      this.router.navigate(['/xat/' + nomXat]);
    } 
  }

  //eliminar xat privat
  eliminarXat(index:number){
    this.userXat.splice(index,1);
    this.removeXat(index);
  }

  //nova Room Xat
  novaRoom(){
    //comprovar si el xat ja existeix
    let comprovacioXat = this.userXat.findIndex((xat)=>(xat.nomXat)==this.nomRoom);
    if(comprovacioXat == -1){
      this.userXat.push({nomXat: this.nomRoom})
      this.addXat();
    } 
      this.sockets.creadaSalaPublica(this.nomRoom);
      this.loginService.creacioSala(this.nomRoom);
      this.llegirMissatges(this.nomRoom);
      this.router.navigate(['/xat/' + this.nomRoom]);
  }

  
}
