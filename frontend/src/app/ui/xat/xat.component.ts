import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-xat',
  templateUrl: './xat.component.html',
  styleUrls: ['./xat.component.scss'],
})
export class XatComponent implements OnInit, AfterViewInit {
  // public userXat: string = 'Xat general';
  public userXat: Array<{ id: number; text: string; usuari: string }>=[{ id: 0, text: '', usuari: 'Xat General' }];

  missatge: string;
  subscription: Subscription;
  subscriptionXats: Subscription;

  xatseleccionat: string;
  xatsHabititats:Array<any>=[];


  taulell = this.fb.group({
    xats: this.fb.array([this.fb.control('')]),
  });

  constructor(
    private sockets: SocketsIoService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    route: ActivatedRoute
  ) {
    // route.params.subscribe((params) => {
    //   this.userXat = params['id'];
    // });
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
    this.subscription = this.sockets.getUltimMissatge().subscribe((msg) => {
      console.log('missatge ' + msg.text);
      this.rebreMissatge(msg.text, msg.usuari);
    });

    this.subscriptionXats = this.sockets.crearXat().subscribe((nomXat) => {
      console.log('Xat creat amb nom: ' + nomXat);
      console.log(this.xatsHabititats);
      let nomBuscat = this.xatsHabititats.findIndex(nomXat => nomXat);
      console.log(nomBuscat);
      if(nomBuscat==-1){
        this.xatsHabititats.push(nomXat); 
        this.afegirXat(nomXat);
      }
    }
    );
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
      //console.log(this.missatge);
      this.sockets.enviarMissatgeGeneral(this.missatge); //Envia al servei el missatge
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

  //Afegir xat privat
  afegirXat(nomXat:string) {
    this.userXat.push({ id: this.userXat.length+1, text: '', usuari: nomXat });
    this.addXat();
  }

  //eliminar xat privat
  eliminarXat(index:number){
    this.userXat.splice(index,1);
    this.removeXat(index);
  }
}
