import { Component, OnInit } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
 
})
export class StatsComponent implements OnInit {
  nom:string;

  constructor(private sockets:SocketsIoService) {}

  ngOnInit(): void {
    setTimeout(() => {
    //console.log('sockets' + this.sockets.nom);
    this.nom = this.sockets.nomJugador;
    //console.log(this.nom);
    }, 500);
  }

}
