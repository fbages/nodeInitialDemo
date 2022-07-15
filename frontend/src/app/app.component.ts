import { Component, OnInit } from '@angular/core';
import { SocketsIoService } from './services/sockets-io/sockets-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {

  constructor(private sockets: SocketsIoService){

  }
  public ngOnInit(): void {

  }

}
