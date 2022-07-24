import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xat-privat',
  templateUrl: './xat-privat.component.html',
  styleUrls: ['./xat-privat.component.scss']
})
export class XatPrivatComponent implements OnInit {
  @Input() destinatari:string; //a definir encara
  missatge:string;
  subscription: Subscription;
  
  emisor:string

    constructor(private sockets:SocketsIoService, private elementRef:ElementRef) { }
  
    ngOnInit(): void {
      this.subscription = this.sockets.rebreUltimMissatgePrivat().subscribe((msg)=>{
        this.rebreMissatge(msg.text,msg.emisor);
      })
    }
  
    ngAfterViewInit(): void {
        this.elementRef.nativeElement.querySelector('#botoEnviar').addEventListener('click', this.enviarMissatgePrivat.bind(this) ); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
    }
  
   enviarMissatgePrivat(destinatari){
    this.destinatari = "hola";
     this.missatge = this.elementRef.nativeElement.querySelector('#inputMissatge').value; //recull missatge del textbox
     if(this.missatge){
       this.elementRef.nativeElement.querySelector('#inputMissatge').value =''; //Buida el textbox per escriure un nou missatge
       this.sockets.enviarMissatgePrivat(this.missatge,destinatari); //Envia al servei el missatge
       this.elementRef.nativeElement.querySelector('#llistatMissatges').innerHTML += `<div style="color:green;text-align:right;">` + this.missatge + '</div><br>';
      }
   }
  
   rebreMissatge(missatgeRebut, emisor){
    this.missatge = missatgeRebut + "-" + emisor;
    this.elementRef.nativeElement.querySelector('#llistatMissatges').innerHTML += `<div style="color:red;text-align:left;">` + this.missatge + '</div><br>';
  
   }
  
  }