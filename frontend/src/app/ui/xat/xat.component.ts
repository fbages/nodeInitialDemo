import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xat',
  templateUrl: './xat.component.html',
  styleUrls: ['./xat.component.scss']
})
export class XatComponent implements OnInit, AfterViewInit {
missatge:string;
subscription: Subscription;

  constructor(private sockets:SocketsIoService, private elementRef:ElementRef) { }

  ngOnInit(): void {
    this.subscription = this.sockets.getUltimMissatge().subscribe((msg)=>{
      this.rebreMissatge(msg,"");
    })
  }

  ngAfterViewInit(): void {
      this.elementRef.nativeElement.querySelector('#botoEnviar').addEventListener('click', this.enviarMissatge.bind(this) ); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

 enviarMissatge(){
   this.missatge = this.elementRef.nativeElement.querySelector('#inputMissatge').value; //recull missatge del textbox
   if(this.missatge){
     this.elementRef.nativeElement.querySelector('#inputMissatge').value =''; //Buida el textbox per escriure un nou missatge
     //console.log(this.missatge);
     this.sockets.enviarMissatgeGeneral(this.missatge); //Envia al servei el missatge
     this.elementRef.nativeElement.querySelector('#llistatMissatges').innerHTML += `<div style="color:green;text-align:right;">` + this.missatge + '</div><br>';
    }
 }

 rebreMissatge(missatgeRebut, missatger){
  this.missatge = missatgeRebut;
  this.elementRef.nativeElement.querySelector('#llistatMissatges').innerHTML += `<div style="color:red;text-align:left;">` + this.missatge + '</div><br>';

 }

}
