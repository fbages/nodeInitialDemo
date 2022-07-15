import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, AfterViewInit {
  nomInput:string;
  
  constructor(private sockets: SocketsIoService, private elementRef:ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void {
    this.elementRef.nativeElement.querySelector('#registreNom').addEventListener('click', this.registrarNom.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

  registrarNom(){
    //this.sockets.nom = this.elementRef.nativeElement.querySelector('#nom').value; //equivalent a document.getElementById
    //console.log(this.sockets.nom);
    this.sockets.nomJugador = this.nomInput;
    console.log(this.sockets.nomJugador);
    this.sockets.registrarJugador();
    
  }

}
